
import { supabase } from "@/integrations/supabase/client";
import type { FleetVehicle, VehicleInTransit } from "@/lib/types/fleet";

export const createFleetVehicle = async (vehicleData: Omit<FleetVehicle, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('fleet_vehicles')
    .insert(vehicleData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFleetVehicle = async (vehicleId: string, updates: Partial<FleetVehicle>) => {
  const { data, error } = await supabase
    .from('fleet_vehicles')
    .update(updates)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const assignVehicleToJob = async (jobId: string, vehicleId: string) => {
  const { error: vehicleError } = await supabase
    .from('fleet_vehicles')
    .update({ status: 'assigned' })
    .eq('id', vehicleId);

  if (vehicleError) throw vehicleError;

  const { error: jobError } = await supabase
    .from('tow_jobs')
    .update({ vehicle_id: vehicleId })
    .eq('id', jobId);

  if (jobError) throw jobError;
};

export const getVehiclesInTransit = async (jobId: string): Promise<VehicleInTransit[]> => {
  const { data, error } = await supabase
    .from('vehicles_in_transit')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const updateVehicleTransitStatus = async (
  transitId: string,
  updates: {
    pickup_status?: 'pending' | 'confirmed' | 'rejected';
    delivery_status?: 'pending' | 'in_transit' | 'delivered';
    pickup_confirmation?: string;
    delivery_confirmation?: string;
  }
) => {
  const { data, error } = await supabase
    .from('vehicles_in_transit')
    .update(updates)
    .eq('id', transitId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
