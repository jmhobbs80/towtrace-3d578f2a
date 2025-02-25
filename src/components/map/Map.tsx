
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DriverLocation {
  driver_id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  job_id?: string;
}

interface MapProps {
  jobId?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const LocationMap = ({ jobId, initialCenter = [-95.7129, 37.0902], initialZoom = 4 }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const { toast } = useToast();
  const [mapboxToken, setMapboxToken] = useState<string>("");

  // Fetch Mapbox token from Edge Function
  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching map configuration",
          description: error.message,
        });
        return;
      }
      setMapboxToken(data.token);
    };
    fetchToken();
  }, [toast]);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCenter,
      zoom: initialZoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, initialCenter, initialZoom]);

  // Subscribe to real-time location updates
  useEffect(() => {
    if (!map.current) return;

    const channel = supabase
      .channel('driver-locations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
          filter: jobId ? `job_id=eq.${jobId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const marker = markersRef.current[payload.old.driver_id];
            if (marker) {
              marker.remove();
              delete markersRef.current[payload.old.driver_id];
            }
            return;
          }

          const location = payload.new as DriverLocation;
          let marker = markersRef.current[location.driver_id];

          if (!marker) {
            marker = new mapboxgl.Marker()
              .setLngLat([location.coordinates.lng, location.coordinates.lat])
              .addTo(map.current!);
            markersRef.current[location.driver_id] = marker;
          } else {
            marker.setLngLat([location.coordinates.lng, location.coordinates.lat]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
    };
  }, [jobId, map.current]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
