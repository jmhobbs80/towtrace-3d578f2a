
import { useEffect, useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface LocationTrackerProps {
  jobId?: string;
  enabled?: boolean;
  updateInterval?: number; // in milliseconds
}

export const LocationTracker = ({ 
  jobId, 
  enabled = true, 
  updateInterval = 30000 // 30 seconds default
}: LocationTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const { toast } = useToast();
  const [watchId, setWatchId] = useState<number | null>(null);
  const [queuedUpdates, setQueuedUpdates] = useState<GeolocationPosition[]>([]);

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

  const updateLocation = useCallback((position: GeolocationPosition) => {
    setLastUpdate(new Date());
    setAccuracy(position.coords.accuracy);

    if (!navigator.onLine) {
      setQueuedUpdates(prev => [...prev, position]);
      return;
    }

    // Queue the update for batch processing
    setQueuedUpdates(prev => [...prev, position]);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Geolocation is not supported by your browser",
      });
      return;
    }

    // Request background location permission if available
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
      const interval = setInterval(processLocationQueue, 5000); // Process every 5 seconds
      return () => clearInterval(interval);
    }
  }, [queuedUpdates, processLocationQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "Back Online",
        description: "Syncing location updates...",
      });
      processLocationQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [toast, processLocationQueue]);

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
      
      {isTracking && lastUpdate && (
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit">
            Last Update: {lastUpdate.toLocaleTimeString()}
          </Badge>
          {accuracy && (
            <Badge variant="outline" className="w-fit">
              Accuracy: ±{Math.round(accuracy)}m
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
