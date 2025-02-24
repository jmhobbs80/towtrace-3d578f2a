
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

// Cache for VIN lookups with timestamp and sync status
interface CachedVehicleData extends VehicleDecodedData {
  timestamp: number;
  needsSync: boolean;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Cache implementation with offline support
class VINCache {
  private cache = new Map<string, CachedVehicleData>();
  private readonly maxSize: number;
  private offlineMode: boolean = !navigator.onLine;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.offlineMode = false;
      this.syncPendingData();
    });
    window.addEventListener('offline', () => {
      this.offlineMode = true;
      console.log('Switched to offline mode');
    });
  }

  async syncPendingData() {
    for (const [vin, data] of this.cache.entries()) {
      if (data.needsSync) {
        try {
          const freshData = await fetchVehicleData(vin);
          this.set(vin, freshData, false);
        } catch (error) {
          console.error(`Failed to sync VIN ${vin}:`, error);
        }
      }
    }
  }

  get(vin: string): VehicleDecodedData | null {
    const data = this.cache.get(vin);
    if (!data) return null;

    // Check if cache entry is expired
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      this.cache.delete(vin);
      return null;
    }

    const { timestamp, needsSync, ...vehicleData } = data;
    return vehicleData;
  }

  set(vin: string, data: VehicleDecodedData, needsSync = false) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(vin, {
      ...data,
      timestamp: Date.now(),
      needsSync
    });
  }

  isOffline(): boolean {
    return this.offlineMode;
  }
}

// Create a singleton instance of the cache
const vinCache = new VINCache();

// Utility function to implement exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch vehicle data with retries
async function fetchVehicleData(vin: string): Promise<VehicleDecodedData> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const results = data.Results;

      if (!results || !Array.isArray(results)) {
        throw new Error('Invalid response format from NHTSA API');
      }

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

      return vehicleData;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES - 1) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Failed to fetch VIN data after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

export const decodeVIN = async (vin: string): Promise<VehicleDecodedData> => {
  // Check cache first
  const cachedData = vinCache.get(vin);
  if (cachedData) {
    console.log('VIN data retrieved from cache');
    return cachedData;
  }

  try {
    const vehicleData = await fetchVehicleData(vin);
    vinCache.set(vin, vehicleData, vinCache.isOffline());
    return vehicleData;
  } catch (error) {
    if (vinCache.isOffline()) {
      // Create a placeholder entry when offline
      const placeholderData: VehicleDecodedData = {
        make: "Pending Sync",
        model: "Offline Entry",
        year: 0,
        vin: vin,
        manufacturer: "Pending Sync",
        vehicleType: "",
        bodyClass: "",
        fuelType: "",
        engineSize: "",
        series: "",
        trim: "",
        plantCountry: "",
        engineCylinders: 0,
        doors: 0,
        safetyRating: "",
      };
      vinCache.set(vin, placeholderData, true);
      return placeholderData;
    }
    throw error;
  }
};

export { type VehicleDecodedData };
