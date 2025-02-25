
import type { Database } from "@/integrations/supabase/types";

export type InventoryStatus = Database['public']['Enums']['inventory_status'];

export interface VehicleData {
  vin: string;
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  status?: InventoryStatus;
  location?: string;
}

export interface ValidationError {
  row: number;
  vin: string;
  error: string;
}

export interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locationId?: string;
  organizationId: string;
}
