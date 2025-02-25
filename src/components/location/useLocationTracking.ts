
import { useState, useCallback, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LocationUpdate, LocationQueue } from './types';

const QUEUE_KEY = 'location_queue';
const MAX_QUEUE_SIZE = 100;

export const useLocationTracking = (
  jobId?: string,
  updateInterval: number = 30000,
  onLocationUpdate?: (position: GeolocationPosition) => void
) => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [queuedUpdates, setQueuedUpdates] = useState<LocationUpdate[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  const calculateETA = useCallback((position: GeolocationPosition) => {
    if (!position.coords.speed || position.coords.speed === 0) {
      setEta(null);
      return;
    }

    // TODO: Replace with actual destination coordinates from job
    const destination = { lat: 0, lng: 0 };
    
    // Calculate distance in meters using Haversine formula
    const R = 6371e3;
    const φ1 = position.coords.latitude * Math.PI / 180;
    const φ2 = destination.lat * Math.PI / 180;
    const Δφ = (destination.lat - position.coords.latitude) * Math.PI / 180;
    const Δλ = (destination.lng - position.coords.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    const etaMinutes = Math.round(distance / (position.coords.speed * 3.6) / 60);
    setEta(etaMinutes);
  }, []);

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

  const startTracking = useCallback(async () => {
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
          updateLocation(position);
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
  }, [updateInterval, toast, updateLocation]);

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

  // Load queued updates from localStorage
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_KEY);
      if (savedQueue) {
        const parsed: LocationQueue = JSON.parse(savedQueue);
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
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  return {
    isTracking,
    lastUpdate,
    accuracy,
    speed,
    eta,
    isOnline,
    queuedUpdates,
    startTracking,
    stopTracking
  };
};
