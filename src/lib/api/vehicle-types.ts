
import type { Json } from '@/integrations/supabase/types';
import type { VINScannerHardware } from './scanner-types';

export type { VINScannerHardware };

export type VehicleDamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'salvage';

export interface CreateDamageReport {
  severity: VehicleDamageSeverity;
  description?: string;
  repair_estimate?: number;
  damage_locations: Json;
  photos: string[];
}

export interface DamageReport extends CreateDamageReport {
  id: string;
  vehicle_id: string;
  inspector_id: string;
  created_at: string;
  updated_at: string;
}

export interface TransitRecord {
  id: string;
  status: string;
  pickup_date: string;
  delivery_date?: string;
  vehicle_id: string;
}

export interface VehicleLocation {
  name: string;
  address: Json;
}

export interface VehicleTransitData {
  id: string;
  delivery_status: string;
  pickup_status: string;
  pickup_confirmation: string | null;
  delivery_confirmation: string | null;
  created_at: string;
  make: string;
  model: string;
}
