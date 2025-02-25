
import type { Database } from "@/integrations/supabase/types";

export type LoadType = Database["public"]["Enums"]["load_type"];
export type BidStatus = Database["public"]["Enums"]["bid_status"];
export type LoadStatus = "open" | "assigned" | "in_transit" | "completed" | "cancelled";

export interface Location {
  address: string;
  coordinates: [number, number];
}

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
  status: LoadStatus;
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

// Helper to convert database JSON to Location type
export function parseLocation(locationJson: any): Location {
  if (!locationJson || typeof locationJson !== 'object') {
    throw new Error('Invalid location data');
  }

  return {
    address: locationJson.address || '',
    coordinates: locationJson.coordinates || [0, 0]
  };
}

// Helper to validate load status
export function isValidLoadStatus(status: string): status is LoadStatus {
  return ['open', 'assigned', 'in_transit', 'completed', 'cancelled'].includes(status);
}
