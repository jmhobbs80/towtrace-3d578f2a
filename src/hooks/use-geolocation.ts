
import { useState, useCallback, useEffect } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { useToast } from "@/hooks/use-toast";

export const useGeolocation = (updateInterval: number = 30000) => {
  const [watchId, setWatchId] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const { toast } = useToast();

  const startTracking = useCallback(async (onUpdate: (position: Position) => void) => {
    try {
      const permResult = await Geolocation.requestPermissions();
      if (permResult.location !== 'granted') {
        throw new Error('Location permission denied');
      }

      const watchId = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: updateInterval / 2
      }, (position, err) => {
        if (err) {
          console.error('Error watching position:', err);
          return;
        }
        if (position) {
          setLastPosition(position);
          onUpdate(position);
        }
      });

      setWatchId(watchId);
      setIsTracking(true);

      toast({
        title: "Location Tracking Started",
        description: "Your location is now being tracked",
      });
    } catch (error) {
      console.error('Error starting location tracking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start location tracking",
      });
    }
  }, [updateInterval, toast]);

  const stopTracking = useCallback(async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
    setIsTracking(false);

    toast({
      title: "Location Tracking Stopped",
      description: "Your location is no longer being tracked",
    });
  }, [watchId, toast]);

  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  return {
    isTracking,
    lastPosition,
    startTracking,
    stopTracking
  };
};
