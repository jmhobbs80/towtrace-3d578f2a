
import { Position } from "@capacitor/geolocation";

export interface LocationUpdate {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number | null;
    heading?: number | null;
  };
  timestamp: number;
}

export interface LocationQueue {
  updates: LocationUpdate[];
  lastSync: number;
}

export interface LocationTrackerProps {
  jobId?: string;
  enabled?: boolean;
  updateInterval?: number;
  onLocationUpdate?: (position: Position) => void;
}
