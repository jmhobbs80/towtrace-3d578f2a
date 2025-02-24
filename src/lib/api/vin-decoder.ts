
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

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

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

import { VINCacheService } from './services/vin-cache';

// Get singleton instance of VINCacheService
const cacheService = VINCacheService.getInstance();

export const decodeVIN = async (vin: string): Promise<VehicleDecodedData> => {
  // Check cache first
  const cachedData = await cacheService.get(vin);
  if (cachedData) {
    console.log('VIN data retrieved from cache');
    return cachedData;
  }

  try {
    const vehicleData = await fetchVehicleData(vin);
    cacheService.set(vin, vehicleData);
    return vehicleData;
  } catch (error) {
    if (!navigator.onLine) {
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
      cacheService.set(vin, placeholderData);
      return placeholderData;
    }
    throw error;
  }
};

export { type VehicleDecodedData };
