
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

export { type VehicleDecodedData };
