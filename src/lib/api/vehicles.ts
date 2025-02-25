
import { BluetoothVINScanner } from './scanners/bluetooth-scanner';
import { WebcamVINScanner } from './scanners/webcam-scanner';
import type { VINScannerHardware } from './scanner-types';
import { validateVIN } from './vin-validator';
import { decodeVIN } from './vin-decoder';

export async function createVINScanner(): Promise<VINScannerHardware> {
  // Try Bluetooth scanner first (for dedicated hardware)
  const bluetoothScanner = new BluetoothVINScanner();
  if (await bluetoothScanner.isAvailable()) {
    console.log('Using Bluetooth VIN scanner');
    return bluetoothScanner;
  }

  // Fall back to webcam scanning
  const webcamScanner = new WebcamVINScanner();
  if (await webcamScanner.isAvailable()) {
    console.log('Using webcam VIN scanner');
    return webcamScanner;
  }

  throw new Error('No VIN scanner hardware available');
}

export async function scanAndValidateVIN(): Promise<{ 
  vin: string; 
  isValid: boolean;
  decodedInfo?: any;
}> {
  try {
    const scanner = await createVINScanner();
    const scannedVIN = await scanner.startScanning();
    
    // Clean up scanner resources
    await scanner.stopScanning();

    // Validate the scanned VIN
    const isValid = validateVIN(scannedVIN);
    
    if (!isValid) {
      throw new Error('Invalid VIN detected');
    }

    // Decode VIN information
    const decodedInfo = await decodeVIN(scannedVIN);

    return {
      vin: scannedVIN,
      isValid: true,
      decodedInfo
    };
  } catch (error) {
    console.error('VIN scanning error:', error);
    throw error;
  }
}
