
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
