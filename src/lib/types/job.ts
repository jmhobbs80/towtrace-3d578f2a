
import type { Database } from "@/integrations/supabase/types";

export interface Location {
  address: string;
  coordinates?: [number, number];
}

export type Job = Database["public"]["Tables"]["tow_jobs"]["Row"] & {
  driver?: {
    first_name: string | null;
    last_name: string | null;
  };
};

// Type guard to check if a value is a Location
export function isLocation(value: unknown): value is Location {
  if (!value || typeof value !== 'object') return false;
  return 'address' in value && typeof (value as Location).address === 'string';
}
