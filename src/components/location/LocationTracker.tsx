
import { useEffect, useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LocationTrackerProps {
  jobId?: string;
  enabled?: boolean;
}

export const LocationTracker = ({ jobId, enabled = true }: LocationTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  const [watchId, setWatchId] = useState<number | null>(null);

  const updateLocation = useCallback(async (position: GeolocationPosition) => {
    const { error } = await supabase
      .from('driver_locations')
      .insert({
        driver_id: (await supabase.auth.getUser()).data.user?.id,
        job_id: jobId,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });

    if (error) {
      console.error('Error updating location:', error);
      toast({
        variant: "destructive",
        title: "Error updating location",
        description: error.message,
      });
    }
  }, [jobId, toast]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Geolocation is not supported by your browser",
      });
      return;
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
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setIsTracking(true);
  }, [updateLocation, toast]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (!enabled) return null;

  return (
    <Button
      variant={isTracking ? "destructive" : "default"}
      onClick={isTracking ? stopTracking : startTracking}
    >
      {isTracking ? "Stop Location Tracking" : "Start Location Tracking"}
    </Button>
  );
};
