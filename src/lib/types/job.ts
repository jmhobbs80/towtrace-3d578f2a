import type { Database } from "@/integrations/supabase/types";

export interface Location {
  address: string;
  coordinates?: [number, number];
}

export interface Job {
  id: string;
  pickup_location: Location;
  delivery_location?: Location;
  assigned_to?: string;
  status: 'pending' | 'assigned' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
  description?: string;
  driver?: {
    first_name: string | null;
    last_name: string | null;
  };
  charge_amount?: number;
  completed_at?: string;
  created_at: string;
  customer_id?: string;
  dispatcher_id?: string;
  driver_id?: string;
  driver_notes?: string;
  eta?: number;
  mileage?: number;
  organization_id: string;
  payment_status?: string;
  photos?: string[];
  scheduled_time?: string;
  signature_url?: string;
  vehicle_id?: string;
  notes?: string;
  service_type?: string;
}

// Type guard to check if a value is a Location
export function isLocation(value: unknown): value is Location {
  if (!value || typeof value !== 'object') return false;
  return 'address' in value && typeof (value as Location).address === 'string';
}

// Helper function to convert Json to Location
export function toLocation(json: any): Location | undefined {
  if (!json) return undefined;
  if (typeof json === 'object' && 'address' in json) {
    return {
      address: json.address as string,
      coordinates: json.coordinates as [number, number] | undefined,
    };
  }
  return undefined;
}
