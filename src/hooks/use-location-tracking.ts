
import { useCallback, useEffect } from 'react';
import { Position } from '@capacitor/geolocation';
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from './use-geolocation';
import { useOfflineQueue } from './use-offline-queue';
import { useETA } from './use-eta';
import type { LocationUpdate } from '@/components/location/types';

export const useLocationTracking = (
  jobId?: string,
  updateInterval: number = 30000,
  onLocationUpdate?: (position: Position) => void
) => {
  const { isTracking, lastPosition, startTracking: startGeoTracking, stopTracking: stopGeoTracking } = useGeolocation(updateInterval);
  const { queuedUpdates, isOnline, addToQueue, clearQueue } = useOfflineQueue();
  const { eta, calculateETA } = useETA();

  const processLocationQueue = useCallback(async () => {
    if (!navigator.onLine || queuedUpdates.length === 0) return;

    try {
      const user = await supabase.auth.getUser();
      const updates = [...queuedUpdates];

      for (const position of updates) {
        const { error } = await supabase
          .from('driver_locations')
          .insert({
            driver_id: user.data.user?.id,
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
      }

      clearQueue();
    } catch (error) {
      console.error('Error processing location queue:', error);
    }
  }, [jobId, queuedUpdates, clearQueue]);

  const handleLocationUpdate = useCallback((position: Position) => {
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
      addToQueue(locationUpdate);
      return;
    }

    // Attempt immediate update if online
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('driver_locations')
          .insert({
            driver_id: user.id,
            job_id: jobId,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
              heading: position.coords.heading,
              timestamp: position.timestamp
            },
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error updating location:', error);
              addToQueue(locationUpdate);
            }
          });
      }
    });
  }, [jobId, addToQueue, calculateETA, onLocationUpdate]);

  const startTracking = useCallback(() => {
    startGeoTracking(handleLocationUpdate);
  }, [startGeoTracking, handleLocationUpdate]);

  // Process queued updates periodically
  useEffect(() => {
    if (queuedUpdates.length > 0) {
      const interval = setInterval(processLocationQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [queuedUpdates, processLocationQueue]);

  return {
    isTracking,
    lastPosition,
    accuracy: lastPosition?.coords.accuracy,
    speed: lastPosition?.coords.speed,
    eta,
    isOnline,
    queuedUpdates,
    startTracking,
    stopTracking: stopGeoTracking
  };
};
