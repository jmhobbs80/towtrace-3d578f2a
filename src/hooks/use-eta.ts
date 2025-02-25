
import { useState, useCallback } from 'react';
import { Position } from '@capacitor/geolocation';

export const useETA = () => {
  const [eta, setEta] = useState<number | null>(null);

  const calculateETA = useCallback((position: Position) => {
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

  return { eta, calculateETA };
};
