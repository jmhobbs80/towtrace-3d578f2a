
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle, VehicleDetails, VehicleSearchFilters, VehicleStatus } from "../types/vehicles";

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
    .eq('condition', 'damaged')
    .order('created_at', { ascending: false });

  if (damageError) throw damageError;

  return {
    ...vehicle,
    inspections,
    transitHistory,
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
