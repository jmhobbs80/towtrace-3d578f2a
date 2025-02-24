
interface VehicleDecodedData {
  make: string;
  model: string;
  year: number;
  vin: string;
  manufacturer: string;
}

export const decodeVIN = async (vin: string): Promise<VehicleDecodedData> => {
  // Using NHTSA's free VIN decoder API
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to decode VIN');
  }

  const results = data.Results;
  
  // Extract relevant fields from the NHTSA response
  const vehicleData: VehicleDecodedData = {
    make: results.find((item: any) => item.Variable === "Make")?.Value || "",
    model: results.find((item: any) => item.Variable === "Model")?.Value || "",
    year: Number(results.find((item: any) => item.Variable === "Model Year")?.Value) || 0,
    vin: vin,
    manufacturer: results.find((item: any) => item.Variable === "Manufacturer Name")?.Value || "",
  };

  return vehicleData;
};
