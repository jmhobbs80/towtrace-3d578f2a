
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle, VehicleDetails, VehicleSearchFilters, VehicleStatus } from "../types/vehicles";
import type { VehicleInspection } from "../types/inspection";
import type { VehicleInTransit } from "../types/fleet";
import type { VINScannerHardware } from "./scanner-types";

// Re-export the VINScannerHardware type
export type { VINScannerHardware };

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
  return data;
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

  // Fetch damage reports
  const { data: damageReports, error: damageError } = await supabase
    .from('vehicle_condition_logs')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (damageError) throw damageError;

  return {
    ...vehicle,
    inspections: inspections as VehicleInspection[],
    transitHistory: transitHistory as VehicleInTransit[],
    damageReports
  };
}

export async function updateVehicleStatus(
  vehicleId: string, 
  status: VehicleStatus
): Promise<void> {
  const { error } = await supabase
    .from('inventory_vehicles')
    .update({ status })
    .eq('id', vehicleId);

  if (error) throw error;
}

// VIN validation and scanning functionality
export function validateVIN(vin: string): boolean {
  // Basic VIN validation (17 characters, alphanumeric)
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

export async function decodeVIN(vin: string): Promise<any> {
  // Simplified VIN decoding mock
  return {
    make: "Unknown",
    model: "Unknown",
    year: 0,
    trim: "Unknown",
    bodyClass: "Unknown",
    engineSize: 0,
    engineCylinders: 0,
    fuelType: "Unknown",
    plantCountry: "Unknown"
  };
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
