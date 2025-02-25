import { supabase } from "@/integrations/supabase/client";
import type { 
  InventoryLocation, 
  InventoryVehicle, 
  VehicleConditionLog,
  BulkUploadRow,
  SearchFilters,
  VehicleSearchResult,
  LocationSummary
} from "../types/inventory";
import { decodeVIN } from "./vin-decoder";

export async function getLocations() {
  const { data, error } = await supabase
    .from('inventory_locations')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function createLocation(location: Pick<InventoryLocation, 'name' | 'address' | 'capacity'> & { organization_id: string }) {
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

export async function addVehicleToInventory(vehicle: Pick<InventoryVehicle, 'make' | 'model' | 'year' | 'vin' | 'organization_id'> & Partial<Omit<InventoryVehicle, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .insert(vehicle)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function bulkAddVehicles(
  vehicles: BulkUploadRow[], 
  locationId: string | undefined,
  organizationId: string
) {
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
          status: 'pending_inspection' as const,
          organization_id: organizationId
        };
      } catch (error) {
        console.error(`Error processing VIN ${vehicle.vin}:`, error);
        return {
          ...vehicle,
          location_id: locationId,
          status: 'pending_inspection' as const,
          organization_id: organizationId
        };
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

export async function addConditionLog(log: Pick<VehicleConditionLog, 'vehicle_id' | 'condition'> & Partial<Omit<VehicleConditionLog, 'id' | 'created_at'>>) {
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

export async function updateVehicleLocation(vehicleId: string, locationId: string) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .update({ location_id: locationId })
    .eq('id', vehicleId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function subscribeToVehicleUpdates(callback: (payload: any) => void) {
  return supabase
    .channel('vehicle-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inventory_vehicles'
      },
      callback
    )
    .subscribe();
}

export async function subscribeToRepairUpdates(callback: (payload: any) => void) {
  return supabase
    .channel('repair-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'repair_orders'
      },
      callback
    )
    .subscribe();
}

export async function searchInventory(
  query: string, 
  filters: SearchFilters = {}
): Promise<VehicleSearchResult[]> {
  const { minPrice, maxPrice, minYear, maxYear, ...restFilters } = filters;

  let dbQuery = supabase
    .from('inventory_vehicles')
    .select(`
      id,
      organization_id,
      location_id,
      make,
      model,
      year,
      vin,
      color,
      trim,
      mileage,
      purchase_price,
      listing_price,
      status,
      condition,
      created_at,
      updated_at,
      location:inventory_locations(name, address),
      condition_logs:vehicle_condition_logs(*)
    `)
    .or(`make.ilike.%${query}%,model.ilike.%${query}%,vin.ilike.%${query}%`);

  // Apply filters
  if (filters.status) dbQuery = dbQuery.eq('status', filters.status);
  if (filters.condition) dbQuery = dbQuery.eq('condition', filters.condition);
  if (filters.make) dbQuery = dbQuery.ilike('make', `%${filters.make}%`);
  if (filters.model) dbQuery = dbQuery.ilike('model', `%${filters.model}%`);
  if (filters.year) dbQuery = dbQuery.eq('year', filters.year);
  if (filters.color) dbQuery = dbQuery.ilike('color', `%${filters.color}%`);
  if (filters.location_id) dbQuery = dbQuery.eq('location_id', filters.location_id);
  
  if (minPrice) dbQuery = dbQuery.gte('listing_price', minPrice);
  if (maxPrice) dbQuery = dbQuery.lte('listing_price', maxPrice);
  if (minYear) dbQuery = dbQuery.gte('year', minYear);
  if (maxYear) dbQuery = dbQuery.lte('year', maxYear);

  const { data, error } = await dbQuery;

  if (error) throw error;
  return data as VehicleSearchResult[];
}

export async function getVehicleInspectionHistory(vehicleId: string) {
  const { data, error } = await supabase
    .from('vehicle_condition_logs')
    .select(`
      *,
      inspector:profiles(first_name, last_name)
    `)
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
