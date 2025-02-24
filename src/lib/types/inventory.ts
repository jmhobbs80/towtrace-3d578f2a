
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
