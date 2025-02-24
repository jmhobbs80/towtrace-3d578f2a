
import type { VehicleInspection } from "./inspection";
import type { VehicleInTransit } from "./fleet";

export type VehicleStatus = 'available' | 'in_transit' | 'pending_inspection' | 'sold' | 'auction_ready' | 'maintenance';

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
  damageReports: VehicleConditionReport[];
}

export interface VehicleConditionReport {
  id: string;
  vehicle_id: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'salvage';
  notes: string;
  photos: string[];
  inspector_id: string;
  created_at: string;
}

export interface VehicleSearchFilters {
  vin?: string;
  make?: string;
  model?: string;
  status?: VehicleStatus;
}
