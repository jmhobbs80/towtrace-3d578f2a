
import type { Database } from "@/integrations/supabase/types";
import type { Location } from "./job";

export type LoadType = Database["public"]["Enums"]["load_type"];
export type BidStatus = Database["public"]["Enums"]["bid_status"];

export interface PriceRange {
  min: number;
  max: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: "ft" | "m";
}

export interface Load {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  load_type: LoadType;
  pickup_location: Location;
  delivery_location: Location;
  pickup_date: string;
  delivery_date: string;
  weight?: number;
  dimensions?: Dimensions;
  price_range?: PriceRange;
  status: string;
  assigned_to?: string;
  created_by: string;
  requirements: string[];
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface LoadBid {
  id: string;
  load_id: string;
  organization_id: string;
  bidder_id: string;
  amount: number;
  proposed_dates?: {
    pickup_date: string;
    delivery_date: string;
  };
  notes?: string;
  status: BidStatus;
  created_at: string;
  updated_at: string;
}
