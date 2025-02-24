
import type { Database } from "@/integrations/supabase/types";

// Basic types from database
export type InventoryLocation = Database["public"]["Tables"]["inventory_locations"]["Row"];
export type InventoryVehicle = Database["public"]["Tables"]["inventory_vehicles"]["Row"];
export type VehicleConditionLog = Database["public"]["Tables"]["vehicle_condition_logs"]["Row"];
export type InventoryStatus = Database["public"]["Enums"]["inventory_status"];
export type VehicleCondition = Database["public"]["Enums"]["vehicle_condition"];

// Simple JSON type definition
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Simplified location type for nested data
export interface LocationSummary {
  name: string;
  address: Json;
}

export interface BulkUploadRow {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  color?: string;
  mileage?: number;
  purchase_price?: number;
  listing_price?: number;
  notes?: string;
}

export interface SearchFilters {
  status?: InventoryStatus;
  condition?: VehicleCondition;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  location_id?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

// Base vehicle search result interface
export interface VehicleSearchResult extends Omit<InventoryVehicle, 'location'> {
  location: LocationSummary;
  condition_logs: VehicleConditionLog[];
}

export interface InspectionLogWithInspector extends VehicleConditionLog {
  inspector?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface LocationStats {
  total: number;
  available: number;
  pending: number;
  capacity: number;
}
