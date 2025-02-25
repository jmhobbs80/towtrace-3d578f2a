import { supabase } from "@/integrations/supabase/client";
import type { VehicleInTransit, FleetVehicle, Dealership } from "../types/fleet";

export async function getVehiclesInTransit(jobId: string): Promise<VehicleInTransit[]> {
  const { data, error } = await supabase
    .from('vehicles_in_transit')
    .select('*')
    .eq('job_id', jobId);

  if (error) {
    console.error("Error fetching vehicles in transit:", error);
    return [];
  }

  return data as VehicleInTransit[];
}

export async function getFleetVehicles(): Promise<FleetVehicle[]> {
  const { data, error } = await supabase
    .from('fleet_vehicles')
    .select('*');

  if (error) {
    console.error("Error fetching fleet vehicles:", error);
    return [];
  }

  return data as FleetVehicle[];
}

export async function getDealerships(): Promise<Dealership[]> {
  const { data, error } = await supabase
    .from('dealerships')
    .select('*');

  if (error) {
    console.error("Error fetching dealerships:", error);
    return [];
  }

  return data as Dealership[];
}

export interface VehicleAssignment {
  id: string;
  vehicle_id: string;
  driver_id: string;
  assigned_by: string | null;
  status: 'pending' | 'active' | 'completed';
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function assignVehicleToDriver(
  vehicleId: string,
  driverId: string
): Promise<VehicleAssignment> {
  const { data: assignment, error } = await supabase
    .from('vehicle_assignments')
    .insert({
      vehicle_id: vehicleId,
      driver_id: driverId,
      assigned_by: (await supabase.auth.getUser()).data.user?.id,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return assignment;
}

export async function startVehicleAssignment(
  assignmentId: string
): Promise<VehicleAssignment> {
  const { data: assignment, error } = await supabase
    .from('vehicle_assignments')
    .update({
      status: 'active',
      started_at: new Date().toISOString()
    })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return assignment;
}

export async function completeVehicleAssignment(
  assignmentId: string
): Promise<void> {
  const { error } = await supabase
    .rpc('complete_vehicle_assignment', { assignment_id: assignmentId });

  if (error) throw error;
}

export async function getActiveAssignment(
  vehicleId: string
): Promise<VehicleAssignment | null> {
  const { data, error } = await supabase
    .from('vehicle_assignments')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getDriverAssignments(
  driverId: string
): Promise<VehicleAssignment[]> {
  const { data, error } = await supabase
    .from('vehicle_assignments')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
