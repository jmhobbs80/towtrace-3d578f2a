
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Location {
  lat: number;
  lng: number;
}

interface RouteOptimizationInput {
  startLocation: Location;
  endLocation: Location;
  preferences?: {
    urgency: 'low' | 'medium' | 'high';
    avoidHighways?: boolean;
    avoidTolls?: boolean;
    vehicleType?: 'tow_truck' | 'flatbed' | 'heavy_duty';
    timeWindowStart?: Date;
    timeWindowEnd?: Date;
  };
  constraints?: {
    maxDistance?: number;
    maxDuration?: number;
    requiredStops?: Location[];
    zoneRestrictions?: string[];
  };
}

interface OptimizedRoute {
  distance: number;
  duration: number;
  suggestedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  waypoints: Location[];
  segments: {
    start: Location;
    end: Location;
    distance: number;
    duration: number;
    instructions?: string;
  }[];
  eta: Date;
  alternativeRoutes?: {
    route: OptimizedRoute;
    savingsPercent: number;
  }[];
  trafficData?: {
    congestionLevel: 'low' | 'medium' | 'high';
    incidents: any[];
  };
}

export const useRouteOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const { toast } = useToast();

  const optimizeRoute = useCallback(async (input: RouteOptimizationInput) => {
    setIsOptimizing(true);

    try {
      // First, get traffic and road condition data
      const { data: conditions, error: conditionsError } = await supabase.functions.invoke('get-road-conditions', {
        body: {
          locations: [input.startLocation, input.endLocation],
          radius: 50 // km
        }
      });

      if (conditionsError) {
        console.error('Error fetching road conditions:', conditionsError);
      }

      // Get historical trip data for better predictions using completed tow jobs
      const { data: historicalData, error: historicalError } = await supabase
        .from('tow_jobs')
        .select('eta, mileage, created_at')
        .eq('status', 'completed')
        .filter('pickup_location->coordinates->0', 'gte', input.startLocation.lat - 0.1)
        .filter('pickup_location->coordinates->0', 'lte', input.startLocation.lat + 0.1)
        .filter('pickup_location->coordinates->1', 'gte', input.startLocation.lng - 0.1)
        .filter('pickup_location->coordinates->1', 'lte', input.startLocation.lng + 0.1)
        .order('created_at', { ascending: false })
        .limit(100);

      if (historicalError) {
        console.error('Error fetching historical data:', historicalError);
      }

      // Call the main route optimization function
      const { data, error } = await supabase.functions.invoke('optimize-route', {
        body: {
          pickup_location: { coordinates: [input.startLocation.lat, input.startLocation.lng] },
          delivery_location: { coordinates: [input.endLocation.lat, input.endLocation.lng] },
          preferences: input.preferences,
          constraints: input.constraints,
          historical_data: historicalData || [],
          road_conditions: conditions || null,
          optimization_params: {
            considerTraffic: true,
            useHistoricalData: true,
            generateAlternatives: true,
            maxAlternatives: 3
          }
        }
      });

      if (error) throw error;

      const optimizedData: OptimizedRoute = {
        distance: data.distance,
        duration: data.estimated_duration,
        suggestedPrice: data.suggested_price,
        priceRange: data.price_range,
        waypoints: data.waypoints,
        segments: data.segments,
        eta: new Date(Date.now() + data.estimated_duration * 1000),
        alternativeRoutes: data.alternative_routes,
        trafficData: data.traffic_data
      };

      setOptimizedRoute(optimizedData);

      // Store optimization result in route_optimizations table with correct schema
      await supabase.from('route_optimizations').insert({
        start_location: { 
          coordinates: [input.startLocation.lat, input.startLocation.lng]
        },
        end_location: { 
          coordinates: [input.endLocation.lat, input.endLocation.lng]
        },
        waypoints: optimizedData.waypoints.map(wp => ({
          coordinates: [wp.lat, wp.lng]
        })),
        estimated_duration: optimizedData.duration,
        estimated_distance: optimizedData.distance,
        optimization_score: 0.95, // Default score for now
        created_at: new Date().toISOString()
      });

      toast({
        title: "Route Optimized",
        description: `ETA: ${optimizedData.eta.toLocaleTimeString()}`,
      });

      return optimizedData;
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimize route. Please try again.",
      });
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, [toast]);

  return {
    isOptimizing,
    optimizedRoute,
    optimizeRoute
  };
};
