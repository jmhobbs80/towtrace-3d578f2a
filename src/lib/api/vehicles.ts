
import { supabase } from "@/integrations/supabase/client";
import type { VehicleCondition, VehicleTransitData, TransitRecord } from './vehicle-types';

export * from './vehicle-types';
export * from './vin-scanner';
export * from './damage-reports';

export async function getVehicles(organizationId: string) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .select('*, location:inventory_locations(name, address), condition_logs:vehicle_condition_logs(*), inspections:vehicle_inspections(*)')
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data;
}

export async function getVehicleDetails(vehicleId: string) {
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('inventory_vehicles')
    .select('*, location:inventory_locations(name, address)')
    .eq('id', vehicleId)
    .single();

  if (vehicleError) throw vehicleError;

  const { data: damageReports, error: damageError } = await supabase
    .from('vehicle_damage_reports')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (damageError) throw damageError;

  const { data: conditionLogs, error: conditionError } = await supabase
    .from('vehicle_condition_logs')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (conditionError) throw conditionError;

  const { data: inspections, error: inspectionError } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (inspectionError) throw inspectionError;

  const { data: transitData, error: transitError } = await supabase
    .from('vehicles_in_transit')
    .select('id, make, model, delivery_status, pickup_status, pickup_confirmation, delivery_confirmation, created_at')
    .eq('vin', vehicleData.vin);

  if (transitError) throw transitError;

  const transitHistory: TransitRecord[] = (transitData || []).map((record: VehicleTransitData) => ({
    id: record.id,
    status: record.delivery_status || record.pickup_status,
    pickup_date: record.pickup_confirmation || record.created_at,
    delivery_date: record.delivery_confirmation || undefined,
    vehicle_id: vehicleId
  }));

  return {
    ...vehicleData,
    damage_reports: damageReports || [],
    condition_logs: conditionLogs || [],
    inspections: inspections || [],
    transit_history: transitHistory
  };
}

export async function updateVehicleStatus(
  vehicleId: string, 
  status: string,
  condition?: VehicleCondition
) {
  const updates: Record<string, any> = { status };
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
