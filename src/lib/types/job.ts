
import type { Database } from "@/integrations/supabase/types";

export interface Location {
  address: string;
  coordinates?: [number, number];
}

type TowJobRow = Database["public"]["Tables"]["tow_jobs"]["Row"];

export type Job = Omit<TowJobRow, 'pickup_location' | 'delivery_location'> & {
  driver?: {
    first_name: string | null;
    last_name: string | null;
  };
  assigned_to?: string;
  pickup_location: Location;
  delivery_location?: Location;
};

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
