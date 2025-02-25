
import type { VehicleInspection } from "./inspection";
import type { VehicleInTransit } from "./fleet";
import type { Json } from "@/integrations/supabase/types";

export type VehicleStatus = 'available' | 'in_transit' | 'pending_inspection' | 'sold' | 'auction_ready' | 'maintenance' | 'pending_repair' | 'in_repair';
export type VehicleDamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';
export type VehicleInspectionResult = 'pass' | 'fail' | 'needs_repair';
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'salvage';

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  status: VehicleStatus;
  condition: VehicleCondition;
  organization_id: string;
  location_id?: string;
  vin_scan_data?: any;
  last_inspection_date?: string;
  next_inspection_due?: string;
  inspection_interval?: string;
  maintenance_history?: any[];
  created_at: string;
  updated_at: string;
}

export interface VehicleDetails extends Vehicle {
  inspections: VehicleInspection[];
  transitHistory: VehicleInTransit[];
  damageReports: VehicleDamageReport[];
}

export interface VehicleDamageReport {
  id: string;
  vehicle_id: string;
  inspector_id: string;
  damage_locations: Json;
  severity: VehicleDamageSeverity;
  description?: string;
  repair_estimate?: number;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface VehicleSearchFilters {
  vin?: string;
  make?: string;
  model?: string;
  status?: VehicleStatus;
}
