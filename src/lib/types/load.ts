
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

export function isPriceRange(value: unknown): value is PriceRange {
  if (!value || typeof value !== 'object') return false;
  const range = value as Partial<PriceRange>;
  return typeof range.min === 'number' && typeof range.max === 'number';
}

export function isDimensions(value: unknown): value is Dimensions {
  if (!value || typeof value !== 'object') return false;
  const dims = value as Partial<Dimensions>;
  return typeof dims.length === 'number' 
    && typeof dims.width === 'number' 
    && typeof dims.height === 'number'
    && (dims.unit === 'ft' || dims.unit === 'm');
}

export function parseLocation(locationJson: unknown): Location {
  if (!locationJson || typeof locationJson !== 'object') {
    return { address: '', coordinates: [0, 0] };
  }

  const location = locationJson as Partial<Location>;
  return {
    address: location.address || '',
    coordinates: Array.isArray(location.coordinates) ? location.coordinates as [number, number] : [0, 0]
  };
}

export function isValidLoadStatus(status: string): status is LoadStatus {
  return ['open', 'assigned', 'in_transit', 'completed', 'cancelled'].includes(status);
}
