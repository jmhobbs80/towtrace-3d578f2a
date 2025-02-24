
import type { VehicleInspection } from "./inspection";
import type { VehicleInTransit } from "./fleet";

export type VehicleStatus = 'available' | 'in_transit' | 'delivered' | 'needs_repair';

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  status: VehicleStatus;
  organization_id: string;
  location_id?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleDetails extends Vehicle {
  inspections: VehicleInspection[];
  transitHistory: VehicleInTransit[];
  damageReports: DamageReport[];
}

export interface DamageReport {
  id: string;
  vehicle_id: string;
  report_date: string;
  damage_description: string;
  photos: string[];
  created_at: string;
}

export interface VehicleSearchFilters {
  vin?: string;
  make?: string;
  model?: string;
  status?: VehicleStatus;
}
