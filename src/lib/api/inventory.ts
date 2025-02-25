
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
    .select('id, name, address, capacity, created_at, updated_at, organization_id')
    .order('name');
  
  if (error) throw error;
  return data as InventoryLocation[];
}

export async function createLocation(location: Pick<InventoryLocation, 'name' | 'address' | 'capacity'> & { organization_id: string }) {
  if (!location.organization_id) {
    throw new Error('Organization ID is required');
  }

  // Ensure name is a string before trimming
  const sanitizedLocation = {
    ...location,
    name: String(location.name).trim(),
    address: typeof location.address === 'string' ? location.address.trim() : location.address
  };

  const { data, error } = await supabase
    .from('inventory_locations')
    .insert(sanitizedLocation)
    .select('id, name, address, capacity, created_at, updated_at, organization_id')
    .single();
  
  if (error) throw error;
  return data;
}

export async function getInventoryVehicles(locationId?: string) {
  let query = supabase
    .from('inventory_vehicles')
    .select(`
      id,
      make,
      model,
      year,
      vin,
      status,
      condition,
      location_id,
      color,
      trim,
      mileage,
      purchase_price,
      listing_price,
      photos,
      notes,
      metadata,
      service_history,
      auction_status,
      auction_result_id,
      auction_date,
      inspection_date,
      damage_report,
      created_at,
      updated_at,
      organization_id,
      location:inventory_locations!inner(
        id,
        name,
        address
      ),
      condition_logs:vehicle_condition_logs(
        id,
        condition,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as InventoryVehicle[];
}

export async function addVehicleToInventory(vehicle: Pick<InventoryVehicle, 'make' | 'model' | 'year' | 'vin' | 'organization_id'> & Partial<Omit<InventoryVehicle, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .insert(vehicle)
    .select('id, make, model, year, vin, status, condition')
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

  const chunkSize = 100;
  const results = [];

  for (let i = 0; i < processedVehicles.length; i += chunkSize) {
    const chunk = processedVehicles.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('inventory_vehicles')
      .insert(chunk)
      .select('id, make, model, year, vin, status');

    if (error) throw error;
    results.push(...(data || []));
  }

  return results;
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
      make,
      model,
      year,
      vin,
      status,
      condition,
      listing_price,
      location:inventory_locations!inner(
        name,
        address
      )
    `)
    .or(`
      make.ilike.%${query}%,
      model.ilike.%${query}%,
      vin.ilike.%${query}%
    `);

  // Apply filters
  if (filters.status) dbQuery = dbQuery.eq('status', filters.status);
  if (filters.condition) dbQuery = dbQuery.eq('condition', filters.condition);
  if (filters.make) dbQuery = dbQuery.ilike('make', `%${filters.make}%`);
  if (filters.model) dbQuery = dbQuery.ilike('model', `%${filters.model}%`);
  if (filters.year) dbQuery = dbQuery.eq('year', filters.year);
  if (filters.location_id) dbQuery = dbQuery.eq('location_id', filters.location_id);
  
  if (minPrice) dbQuery = dbQuery.gte('listing_price', minPrice);
  if (maxPrice) dbQuery = dbQuery.lte('listing_price', maxPrice);
  if (minYear) dbQuery = dbQuery.gte('year', minYear);
  if (maxYear) dbQuery = dbQuery.lte('year', maxYear);

  const { data, error } = await dbQuery;
  if (error) throw error;
  return data as VehicleSearchResult[];
}

export async function addConditionLog(log: Pick<VehicleConditionLog, 'vehicle_id' | 'condition'> & Partial<Omit<VehicleConditionLog, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('vehicle_condition_logs')
    .insert(log)
    .select('id, condition, created_at')
    .single();
  
  if (error) throw error;
  return data;
}

export async function getVehicleInspectionHistory(vehicleId: string) {
  const { data, error } = await supabase
    .from('vehicle_condition_logs')
    .select(`
      id,
      condition,
      created_at,
      inspector:profiles(
        first_name,
        last_name
      )
    `)
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
