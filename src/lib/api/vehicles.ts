interface VehicleDecodedData {
  make: string;
  model: string;
  year: number;
  vin: string;
  manufacturer: string;
  vehicleType: string;
  bodyClass: string;
  fuelType: string;
  engineSize: string;
  series: string;
  trim: string;
  plantCountry: string;
  engineCylinders: number;
  doors: number;
  safetyRating: string;
}

// Cache for VIN lookups
const vinCache = new Map<string, VehicleDecodedData>();

export const decodeVIN = async (vin: string): Promise<VehicleDecodedData> => {
  // Check cache first
  const cachedData = vinCache.get(vin);
  if (cachedData) {
    console.log('VIN data retrieved from cache');
    return cachedData;
  }

  // Using NHTSA's free VIN decoder API
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to decode VIN');
  }

  const results = data.Results;
  
  // Extract comprehensive vehicle data from the NHTSA response
  const vehicleData: VehicleDecodedData = {
    make: results.find((item: any) => item.Variable === "Make")?.Value || "",
    model: results.find((item: any) => item.Variable === "Model")?.Value || "",
    year: Number(results.find((item: any) => item.Variable === "Model Year")?.Value) || 0,
    vin: vin,
    manufacturer: results.find((item: any) => item.Variable === "Manufacturer Name")?.Value || "",
    vehicleType: results.find((item: any) => item.Variable === "Vehicle Type")?.Value || "",
    bodyClass: results.find((item: any) => item.Variable === "Body Class")?.Value || "",
    fuelType: results.find((item: any) => item.Variable === "Fuel Type - Primary")?.Value || "",
    engineSize: results.find((item: any) => item.Variable === "Engine Size")?.Value || "",
    series: results.find((item: any) => item.Variable === "Series")?.Value || "",
    trim: results.find((item: any) => item.Variable === "Trim")?.Value || "",
    plantCountry: results.find((item: any) => item.Variable === "Plant Country")?.Value || "",
    engineCylinders: Number(results.find((item: any) => item.Variable === "Engine Number of Cylinders")?.Value) || 0,
    doors: Number(results.find((item: any) => item.Variable === "Doors")?.Value) || 0,
    safetyRating: results.find((item: any) => item.Variable === "Safety Rating")?.Value || "",
  };

  // Store in cache
  if (vinCache.size >= 100) {
    const firstKey = vinCache.keys().next().value;
    vinCache.delete(firstKey);
  }
  vinCache.set(vin, vehicleData);

  return vehicleData;
};

export const validateVIN = (vin: string): boolean => {
  // VIN must be 17 characters
  if (vin.length !== 17) return false;

  // VIN can only contain alphanumeric characters (excluding I, O, Q)
  const validVINRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!validVINRegex.test(vin)) return false;

  // Add checksum validation
  const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  const values: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
  };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = values[char] || Number(char);
    sum += value * weights[i];
  }

  const check = sum % 11;
  const checkDigit = check === 10 ? 'X' : check.toString();
  return checkDigit === vin[8];
};

// Web Bluetooth API types
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  watchAdvertisements?: () => Promise<void>;
  unwatchAdvertisements?: () => void;
  addEventListener?: (type: string, listener: EventListener) => void;
  removeEventListener?: (type: string, listener: EventListener) => void;
}

// Hardware integration interface
export interface VINScannerHardware {
  isAvailable: () => Promise<boolean>;
  startScanning: () => Promise<string>;
  stopScanning: () => Promise<void>;
}

// Different scanner implementations
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { HTMLCanvasElementLuminanceSource, BrowserCodeReader } from '@zxing/browser';

class WebcamVINScanner implements VINScannerHardware {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;

  constructor() {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39, BarcodeFormat.CODE_128]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    this.reader = new BrowserMultiFormatReader(hints);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  async startScanning(): Promise<string> {
    try {
      this.videoElement = document.createElement('video');
      this.videoElement.style.position = 'fixed';
      this.videoElement.style.top = '50%';
      this.videoElement.style.left = '50%';
      this.videoElement.style.transform = 'translate(-50%, -50%)';
      this.videoElement.style.zIndex = '1000';
      document.body.appendChild(this.videoElement);

      // Get user media
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      // Start continuous scanning
      const result = await this.reader.decodeFromVideoElement(this.videoElement);
      
      // Clean up after successful scan
      this.cleanup();
      
      if (!result?.getText()) {
        throw new Error('No barcode detected');
      }

      return result.getText();
    } catch (error) {
      this.cleanup();
      throw new Error('Failed to scan barcode');
    }
  }

  async stopScanning(): Promise<void> {
    this.cleanup();
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.remove();
      this.videoElement = null;
    }
  }
}

interface BluetoothRemoteGATTServer {
  getPrimaryService: (service: string) => Promise<BluetoothRemoteGATTService>;
  connect: () => Promise<BluetoothRemoteGATTServer>;
  connected: boolean;
  disconnect: () => void;
}

interface BluetoothRemoteGATTService {
  getCharacteristic: (characteristic: string) => Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  readValue: () => Promise<DataView>;
}

interface BluetoothDeviceWithGATT extends BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
}

class BluetoothVINScanner implements VINScannerHardware {
  private device: BluetoothDeviceWithGATT | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  async isAvailable(): Promise<boolean> {
    return !!(navigator as Navigator & { bluetooth?: { requestDevice: Function } }).bluetooth;
  }

  async startScanning(): Promise<string> {
    try {
      // Request Bluetooth device with Serial Port Profile
      const bluetooth = (navigator as Navigator & { bluetooth?: { requestDevice: Function } }).bluetooth;
      if (!bluetooth) {
        throw new Error('Bluetooth not supported');
      }

      this.device = await bluetooth.requestDevice({
        filters: [
          { services: ['battery_service'] }
        ]
      }) as BluetoothDeviceWithGATT;

      if (!this.device.gatt) {
        throw new Error('Bluetooth device not found');
      }

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      this.characteristic = await service.getCharacteristic('battery_level');

      const value = await this.characteristic.readValue();
      const decoder = new TextDecoder();
      const vin = decoder.decode(value);

      if (!vin) {
        throw new Error('No VIN detected');
      }

      return vin;
    } catch (error) {
      await this.stopScanning();
      throw new Error('Failed to connect to Bluetooth scanner');
    }
  }

  async stopScanning(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }
}

// Scanner factory
export const createVINScanner = async (): Promise<VINScannerHardware> => {
  const bluetoothScanner = new BluetoothVINScanner();
  const webcamScanner = new WebcamVINScanner();

  if (await bluetoothScanner.isAvailable()) {
    return bluetoothScanner;
  } else if (await webcamScanner.isAvailable()) {
    return webcamScanner;
  }
  
  throw new Error('No VIN scanner hardware available');
};
