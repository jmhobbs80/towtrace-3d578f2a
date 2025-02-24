
import type { Database } from "@/integrations/supabase/types";

export type InventoryLocation = Database["public"]["Tables"]["inventory_locations"]["Row"];
export type InventoryVehicle = Database["public"]["Tables"]["inventory_vehicles"]["Row"];
export type VehicleConditionLog = Database["public"]["Tables"]["vehicle_condition_logs"]["Row"];

export type InventoryStatus = Database["public"]["Enums"]["inventory_status"];
export type VehicleCondition = Database["public"]["Enums"]["vehicle_condition"];

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

// Simplified location type for nested data
export interface LocationSummary {
  name: string;
  address: Json;
}

// Base vehicle search result interface with explicit typing
export interface VehicleSearchResult {
  id: string;
  organization_id: string;
  location_id: string | null;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: InventoryStatus | null;
  condition: VehicleCondition | null;
  location: LocationSummary;
  condition_logs: VehicleConditionLog[];
  color?: string | null;
  mileage?: number | null;
  listing_price?: number | null;
  purchase_price?: number | null;
  trim?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
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

type Json = Database["public"]["CompositeTypes"] extends { json: infer T } ? T : never;
