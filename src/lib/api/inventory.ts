
import { supabase } from "@/integrations/supabase/client";
import type { 
  InventoryLocation, 
  InventoryVehicle, 
  VehicleConditionLog,
  BulkUploadRow 
} from "../types/inventory";
import { decodeVIN } from "./vin-decoder";

export async function getLocations() {
  const { data, error } = await supabase
    .from('inventory_locations')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function createLocation(location: Partial<InventoryLocation>) {
  const { data, error } = await supabase
    .from('inventory_locations')
    .insert(location)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getInventoryVehicles(locationId?: string) {
  let query = supabase
    .from('inventory_vehicles')
    .select(`
      *,
      location:inventory_locations(name, address),
      condition_logs:vehicle_condition_logs(*)
    `);

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addVehicleToInventory(vehicle: Partial<InventoryVehicle>) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .insert(vehicle)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function bulkAddVehicles(vehicles: BulkUploadRow[], locationId?: string) {
  const processedVehicles = await Promise.all(
    vehicles.map(async (vehicle) => {
      try {
        const vinData = await decodeVIN(vehicle.vin);
        return {
          ...vehicle,
          location_id: locationId,
          make: vinData.make || vehicle.make,
          model: vinData.model || vehicle.model,
          year: vinData.year || vehicle.year,
          status: 'pending_inspection' as const
        };
      } catch (error) {
        console.error(`Error processing VIN ${vehicle.vin}:`, error);
        return vehicle;
      }
    })
  );

  const { data, error } = await supabase
    .from('inventory_vehicles')
    .insert(processedVehicles)
    .select();

  if (error) throw error;
  return data;
}

export async function addConditionLog(log: Partial<VehicleConditionLog>) {
  const { data, error } = await supabase
    .from('vehicle_condition_logs')
    .insert(log)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateVehicleStatus(
  vehicleId: string,
  status: InventoryVehicle['status'],
  condition?: InventoryVehicle['condition']
) {
  const updates: Partial<InventoryVehicle> = { status };
  if (condition) updates.condition = condition;

  const { data, error } = await supabase
    .from('inventory_vehicles')
    .update(updates)
    .eq('id', vehicleId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
