
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

  // Store in cache (with a maximum of 100 entries to prevent memory issues)
  if (vinCache.size >= 100) {
    const firstKey = vinCache.keys().next().value;
    vinCache.delete(firstKey);
  }
  vinCache.set(vin, vehicleData);

  return vehicleData;
};

// Validate VIN format
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

// Hardware integration interface
export interface VINScannerHardware {
  isAvailable: () => Promise<boolean>;
  startScanning: () => Promise<string>;
  stopScanning: () => Promise<void>;
}

// Different scanner implementations
class WebcamVINScanner implements VINScannerHardware {
  async isAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  async startScanning(): Promise<string> {
    // In a real implementation, this would use a barcode scanning library
    // For demo purposes, we're returning a mock VIN
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("1HGCM82633A123456");
      }, 1500);
    });
  }

  async stopScanning(): Promise<void> {
    // Clean up camera resources
    return Promise.resolve();
  }
}

class BluetoothVINScanner implements VINScannerHardware {
  async isAvailable(): Promise<boolean> {
    return 'bluetooth' in navigator;
  }

  async startScanning(): Promise<string> {
    // In a real implementation, this would connect to a Bluetooth scanner
    // For demo purposes, we're returning a mock VIN
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("5FNRL6H58NB058437");
      }, 1500);
    });
  }

  async stopScanning(): Promise<void> {
    // Disconnect from Bluetooth device
    return Promise.resolve();
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
