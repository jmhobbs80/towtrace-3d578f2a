
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle, VehicleDetails, VehicleSearchFilters, VehicleStatus, VehicleDamageReport } from "../types/vehicles";
import type { VehicleInspection } from "../types/inspection";
import type { VehicleInTransit } from "../types/fleet";
import type { VINScannerHardware } from "./scanner-types";
import type { Database } from "@/integrations/supabase/types";

// Re-export the VINScannerHardware type
export type { VINScannerHardware };

type Tables = Database['public']['Tables']
type DamageReportRow = Tables['vehicle_damage_reports']['Row'];

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function searchVehicles(filters: VehicleSearchFilters): Promise<Vehicle[]> {
  let query = supabase
    .from('inventory_vehicles')
    .select('*');

  if (filters.vin) {
    query = query.ilike('vin', `%${filters.vin}%`);
  }
  if (filters.make) {
    query = query.ilike('make', `%${filters.make}%`);
  }
  if (filters.model) {
    query = query.ilike('model', `%${filters.model}%`);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Vehicle[];
}

export async function getVehicleDetails(vehicleId: string): Promise<VehicleDetails> {
  // Fetch vehicle basic info
  const { data: vehicle, error: vehicleError } = await supabase
    .from('inventory_vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();

  if (vehicleError) throw vehicleError;

  // Fetch inspections
  const { data: inspections, error: inspectionsError } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (inspectionsError) throw inspectionsError;

  // Fetch transit history
  const { data: transitHistory, error: transitError } = await supabase
    .from('vehicles_in_transit')
    .select('*')
    .eq('vin', vehicle.vin)
    .order('created_at', { ascending: false });

  if (transitError) throw transitError;

  // Fetch damage reports using RPC
  const { data: damageReportsRaw, error: damageError } = await supabase
    .rpc('get_vehicle_damage_reports', { vehicle_id_param: vehicleId });

  if (damageError) throw damageError;

  // Transform damage reports to match our interface
  const damageReports = (damageReportsRaw || []).map((report: DamageReportRow): VehicleDamageReport => ({
    id: report.id,
    vehicle_id: report.vehicle_id,
    inspector_id: report.inspector_id,
    damage_locations: report.damage_locations,
    severity: report.severity,
    description: report.description || undefined,
    repair_estimate: report.repair_estimate || undefined,
    photos: report.photos || [],
    created_at: report.created_at,
    updated_at: report.updated_at
  }));

  return {
    ...vehicle,
    inspections: inspections as VehicleInspection[],
    transitHistory: transitHistory as VehicleInTransit[],
    damageReports
  };
}

export async function updateVehicleStatus(
  vehicleId: string, 
  status: VehicleStatus,
  updates: Partial<Vehicle> = {}
): Promise<void> {
  const { error } = await supabase
    .from('inventory_vehicles')
    .update({ status, ...updates })
    .eq('id', vehicleId);

  if (error) throw error;
}

export async function createDamageReport(
  report: Omit<VehicleDamageReport, 'id' | 'created_at' | 'updated_at'>
): Promise<VehicleDamageReport> {
  const { data: newReport, error } = await supabase
    .rpc('create_damage_report', {
      vehicle_id_param: report.vehicle_id,
      inspector_id_param: report.inspector_id,
      damage_locations_param: report.damage_locations,
      severity_param: report.severity,
      description_param: report.description,
      repair_estimate_param: report.repair_estimate,
      photos_param: report.photos
    });

  if (error) throw error;

  return {
    id: newReport.id,
    vehicle_id: newReport.vehicle_id,
    inspector_id: newReport.inspector_id,
    damage_locations: newReport.damage_locations,
    severity: newReport.severity,
    description: newReport.description || undefined,
    repair_estimate: newReport.repair_estimate || undefined,
    photos: newReport.photos || [],
    created_at: newReport.created_at,
    updated_at: newReport.updated_at
  };
}

export function validateVIN(vin: string): boolean {
  // Basic VIN validation (17 characters, alphanumeric)
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

export async function decodeVIN(vin: string): Promise<any> {
  // VIN decoding implementation
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error('Failed to decode VIN');
  }

  return {
    make: data.Results.find((item: any) => item.Variable === "Make")?.Value || "Unknown",
    model: data.Results.find((item: any) => item.Variable === "Model")?.Value || "Unknown",
    year: Number(data.Results.find((item: any) => item.Variable === "ModelYear")?.Value) || 0,
    trim: data.Results.find((item: any) => item.Variable === "Trim")?.Value || "Unknown",
    bodyClass: data.Results.find((item: any) => item.Variable === "BodyClass")?.Value || "Unknown",
    engineSize: data.Results.find((item: any) => item.Variable === "EngineSize")?.Value || 0,
    engineCylinders: data.Results.find((item: any) => item.Variable === "EngineCylinders")?.Value || 0,
    fuelType: data.Results.find((item: any) => item.Variable === "FuelType")?.Value || "Unknown",
    plantCountry: data.Results.find((item: any) => item.Variable === "PlantCountry")?.Value || "Unknown"
  };
}

export async function uploadVehiclePhotos(vehicleId: string, files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${vehicleId}/${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('vehicle-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
}

export async function createVINScanner(): Promise<VINScannerHardware> {
  // Mock VIN scanner implementation
  return {
    isAvailable: async () => true,
    startScanning: async () => {
      throw new Error("VIN scanner not implemented");
    },
    stopScanning: async () => {}
  };
}
