
export interface Location {
  address: string;
  coordinates: [number, number];
}

export interface LoadPrice {
  min: number;
  max: number;
}

export interface Load {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  load_type: 'vehicle' | 'cargo' | 'equipment';
  status: 'open' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  created_by: string;
  assigned_to?: string;
  pickup_location: Location;
  delivery_location: Location;
  pickup_date: string;
  delivery_date: string;
  price_range?: LoadPrice;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  weight?: number;
  photos?: string[];
  requirements?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
