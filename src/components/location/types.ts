
export interface LocationTrackerProps {
  jobId?: string;
  enabled?: boolean;
  updateInterval?: number;
  onLocationUpdate?: (position: GeolocationPosition) => void;
}

export interface LocationUpdate {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number | null;
    heading: number | null;
  };
  timestamp: number;
}

export interface LocationQueue {
  updates: LocationUpdate[];
  lastSync: number;
}
