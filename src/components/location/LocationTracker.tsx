
import { useEffect, useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Navigation, Timer } from "lucide-react";

interface LocationTrackerProps {
  jobId?: string;
  enabled?: boolean;
  updateInterval?: number;
  onLocationUpdate?: (position: GeolocationPosition) => void;
}

interface LocationUpdate {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number | null;
    heading: number | null;
  };
  timestamp: number;
}

interface LocationQueue {
  updates: LocationUpdate[];
  lastSync: number;
}

const QUEUE_KEY = 'location_queue';
const MAX_QUEUE_SIZE = 100;

export const LocationTracker = ({ 
  jobId, 
  enabled = true, 
  updateInterval = 30000,
  onLocationUpdate 
}: LocationTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const { toast } = useToast();
  const [watchId, setWatchId] = useState<number | null>(null);
  const [queuedUpdates, setQueuedUpdates] = useState<LocationUpdate[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load queued updates from localStorage
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_KEY);
      if (savedQueue) {
        const parsed: LocationQueue = JSON.parse(savedQueue);
        // Only restore updates that are less than 24 hours old
        const validUpdates = parsed.updates.filter(
          update => Date.now() - update.timestamp < 24 * 60 * 60 * 1000
        );
        setQueuedUpdates(validUpdates);
      }
    } catch (error) {
      console.error('Error loading queued updates:', error);
    }
  }, []);

  // Save queued updates to localStorage
  useEffect(() => {
    if (queuedUpdates.length > 0) {
      try {
        const queue: LocationQueue = {
          updates: queuedUpdates.slice(-MAX_QUEUE_SIZE),
          lastSync: Date.now()
        };
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      } catch (error) {
        console.error('Error saving queued updates:', error);
      }
    }
  }, [queuedUpdates]);

  const processLocationQueue = useCallback(async () => {
    if (!navigator.onLine || queuedUpdates.length === 0) return;

    const updates = [...queuedUpdates];
    setQueuedUpdates([]);

    for (const position of updates) {
      try {
        const { error } = await supabase
          .from('driver_locations')
          .insert({
            driver_id: (await supabase.auth.getUser()).data.user?.id,
            job_id: jobId,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
              heading: position.coords.heading,
              timestamp: position.timestamp
            },
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating location:', error);
        // Re-queue failed updates
        setQueuedUpdates(prev => [...prev, position]);
        
        toast({
          variant: "destructive",
          title: "Error updating location",
          description: error instanceof Error ? error.message : "Failed to update location",
        });
      }
    }
  }, [jobId, toast, queuedUpdates]);

  const calculateETA = useCallback((position: GeolocationPosition) => {
    if (!position.coords.speed || position.coords.speed === 0) {
      setEta(null);
      return;
    }

    // TODO: Replace with actual destination coordinates from job
    const destination = { lat: 0, lng: 0 };
    
    // Calculate distance in meters using Haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = position.coords.latitude * Math.PI / 180;
    const φ2 = destination.lat * Math.PI / 180;
    const Δφ = (destination.lat - position.coords.latitude) * Math.PI / 180;
    const Δλ = (destination.lng - position.coords.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Calculate ETA in minutes
    const etaMinutes = Math.round(distance / (position.coords.speed * 3.6) / 60);
    setEta(etaMinutes);
  }, []);

  const updateLocation = useCallback((position: GeolocationPosition) => {
    setLastUpdate(new Date());
    setAccuracy(position.coords.accuracy);
    setSpeed(position.coords.speed);
    calculateETA(position);

    if (onLocationUpdate) {
      onLocationUpdate(position);
    }

    const locationUpdate: LocationUpdate = {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
      },
      timestamp: position.timestamp,
    };

    if (!navigator.onLine) {
      setQueuedUpdates(prev => [...prev.slice(-MAX_QUEUE_SIZE), locationUpdate]);
      return;
    }

    setQueuedUpdates(prev => [...prev, locationUpdate]);
  }, [onLocationUpdate, calculateETA]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Geolocation is not supported by your browser",
      });
      return;
    }

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'denied') {
            toast({
              variant: "destructive",
              title: "Location Access Denied",
              description: "Please enable location services to track your position",
            });
          }
        });
    }

    const id = navigator.geolocation.watchPosition(
      updateLocation,
      (error) => {
        console.error('Error watching position:', error);
        toast({
          variant: "destructive",
          title: "Error tracking location",
          description: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: updateInterval / 2,
      }
    );

    setWatchId(id);
    setIsTracking(true);

    toast({
      title: "Location Tracking Started",
      description: "Your location is now being tracked",
    });
  }, [updateInterval, toast, updateLocation]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);

    toast({
      title: "Location Tracking Stopped",
      description: "Your location is no longer being tracked",
    });
  }, [watchId, toast]);

  // Process queued updates periodically
  useEffect(() => {
    if (queuedUpdates.length > 0) {
      const interval = setInterval(processLocationQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [queuedUpdates, processLocationQueue]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing location updates...",
      });
      processLocationQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Location updates will be queued until connection is restored",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, processLocationQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (!enabled) return null;

  return (
    <div className="space-y-2">
      <Button
        variant={isTracking ? "destructive" : "default"}
        onClick={isTracking ? stopTracking : startTracking}
        className="w-full"
      >
        {isTracking ? "Stop Location Tracking" : "Start Location Tracking"}
      </Button>
      
      {isTracking && (
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit">
            {isOnline ? (
              <Wifi className="mr-2 h-4 w-4" />
            ) : (
              <WifiOff className="mr-2 h-4 w-4" />
            )}
            {isOnline ? "Online" : "Offline Mode"}
          </Badge>
          
          {lastUpdate && (
            <Badge variant="outline" className="w-fit">
              <Timer className="mr-2 h-4 w-4" />
              Last Update: {lastUpdate.toLocaleTimeString()}
            </Badge>
          )}
          
          {accuracy && (
            <Badge variant="outline" className="w-fit">
              <Navigation className="mr-2 h-4 w-4" />
              Accuracy: ±{Math.round(accuracy)}m
            </Badge>
          )}

          {speed !== null && (
            <Badge variant="outline" className="w-fit">
              Speed: {Math.round(speed * 3.6)} km/h
            </Badge>
          )}

          {eta !== null && (
            <Badge variant="secondary" className="w-fit">
              ETA: {eta} minutes
            </Badge>
          )}
          
          {queuedUpdates.length > 0 && (
            <Badge variant="secondary" className="w-fit">
              Pending Updates: {queuedUpdates.length}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
