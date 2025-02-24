
export interface FleetVehicle {
  id: string;
  organization_id: string;
  vehicle_type: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'assigned';
  make: string | null;
  model: string | null;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  created_at: string;
  updated_at: string;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
}

export interface VehicleInTransit {
  id: string;
  job_id: string;
  vin: string;
  make: string;
  model: string;
  year: number | null;
  pickup_status: 'pending' | 'confirmed' | 'rejected';
  delivery_status: 'pending' | 'in_transit' | 'delivered';
  pickup_confirmation: string | null;
  delivery_confirmation: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dealership {
  id: string;
  organization_id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contact_info: {
    name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}
