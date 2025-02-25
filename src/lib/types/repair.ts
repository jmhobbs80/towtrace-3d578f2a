
import type { Database } from "@/integrations/supabase/types";

export type RepairFacility = Database["public"]["Tables"]["repair_facilities"]["Row"];
export type RepairOrder = Database["public"]["Tables"]["repair_orders"]["Row"];
export type RepairItem = Database["public"]["Tables"]["repair_items"]["Row"];
export type RepairItemStatus = Database["public"]["Enums"]["repair_item_status"];

export interface CreateRepairFacilityParams {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contact_info?: {
    phone?: string;
    email?: string;
    contact_name?: string;
  };
  capacity?: number;
  organization_id: string;
}

export interface CreateRepairOrderParams {
  vehicle_id: string;
  facility_id: string;
  organization_id: string;
  estimated_completion_date?: string;
  notes?: string;
}

export interface CreateRepairItemParams {
  repair_order_id: string;
  type: string;
  description?: string;
  estimated_cost?: number;
  parts_used?: Record<string, any>;
  labor_hours?: number;
  notes?: string;
}

export interface UpdateRepairItemParams {
  id: string;
  status?: RepairItemStatus;
  actual_cost?: number;
  parts_used?: Record<string, any>;
  labor_hours?: number;
  notes?: string;
  photos?: string[];
}
