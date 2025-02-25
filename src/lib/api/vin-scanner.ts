import { BluetoothVINScanner } from './scanners/bluetooth-scanner';
import { WebcamVINScanner } from './scanners/webcam-scanner';
import { OCRVINScanner } from './scanners/ocr-scanner';
import { supabase } from "@/integrations/supabase/client";
import type { VINScannerHardware, ScanMethod, ScanResult } from './scanner-types';

export async function createVINScanner(preferredMethod?: ScanMethod): Promise<VINScannerHardware> {
  // Try preferred method first if specified
  if (preferredMethod) {
    const scanner = await createScannerByMethod(preferredMethod);
    if (scanner && await scanner.isAvailable()) {
      console.log(`Using preferred ${preferredMethod} VIN scanner`);
      return scanner;
    }
  }

  // Otherwise try scanners in priority order
  const bluetoothScanner = new BluetoothVINScanner();
  if (await bluetoothScanner.isAvailable()) {
    console.log('Using Bluetooth VIN scanner');
    return bluetoothScanner;
  }

  const ocrScanner = new OCRVINScanner();
  if (await ocrScanner.isAvailable()) {
    console.log('Using OCR VIN scanner');
    return ocrScanner;
  }

  const webcamScanner = new WebcamVINScanner();
  if (await webcamScanner.isAvailable()) {
    console.log('Using webcam VIN scanner');
    return webcamScanner;
  }

  throw new Error('No VIN scanner hardware available');
}

async function createScannerByMethod(method: ScanMethod): Promise<VINScannerHardware | null> {
  switch (method) {
    case 'barcode':
      return new BluetoothVINScanner();
    case 'ocr':
      return new OCRVINScanner();
    default:
      return null;
  }
}

export function validateVIN(vin: string): boolean {
  return vin.length === 17 && /^[A-HJ-NP-TV-Z0-9]{17}$/.test(vin);
}

export async function decodeVIN(vin: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('decode-vin', {
      body: { vin }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('VIN decode error:', error);
    throw error;
  }
}

export async function scanAndValidateVIN(preferredMethod?: ScanMethod): Promise<{ 
  vin: string; 
  isValid: boolean;
  decodedInfo?: any;
  scanResult?: ScanResult;
}> {
  try {
    const scanner = await createVINScanner(preferredMethod);
    const startTime = Date.now();
    const scannedVIN = await scanner.startScanning();
    
    await scanner.stopScanning();
    const isValid = validateVIN(scannedVIN);
    
    if (!isValid) {
      throw new Error('Invalid VIN detected');
    }

    const decodedInfo = await decodeVIN(scannedVIN);
    
    const scanResult: ScanResult = {
      vin: scannedVIN,
      method: scanner.getScanMethod(),
      timestamp: startTime,
      confidence: scanner.getScanMethod() === 'ocr' ? 0.95 : 1.0
    };

    return {
      vin: scannedVIN,
      isValid: true,
      decodedInfo,
      scanResult
    };
  } catch (error) {
    console.error('VIN scanning error:', error);
    throw error;
  }
}

export async function queueOfflineVINScan(scanResult: ScanResult): Promise<void> {
  try {
    const { error } = await supabase
      .from('offline_sync_queue')
      .insert({
        entity_type: 'vin_scan',
        data: scanResult,
        status: 'pending'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error queuing offline VIN scan:', error);
    // Store in localStorage as fallback
    const offlineScans = JSON.parse(localStorage.getItem('offlineVINScans') || '[]');
    offlineScans.push(scanResult);
    localStorage.setItem('offlineVINScans', JSON.stringify(offlineScans));
  }
}
