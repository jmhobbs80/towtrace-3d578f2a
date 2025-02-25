
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RouteOptimizationInput {
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
  preferences?: {
    urgency: 'low' | 'medium' | 'high';
    avoidHighways?: boolean;
    avoidTolls?: boolean;
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
}

export const useRouteOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const { toast } = useToast();

  const optimizeRoute = useCallback(async (input: RouteOptimizationInput) => {
    setIsOptimizing(true);

    try {
      const { data, error } = await supabase.functions.invoke('optimize-route', {
        body: {
          pickup_location: { coordinates: [input.startLocation.lat, input.startLocation.lng] },
          delivery_location: { coordinates: [input.endLocation.lat, input.endLocation.lng] },
          preferences: input.preferences
        }
      });

      if (error) throw error;

      setOptimizedRoute({
        distance: data.distance,
        duration: data.estimated_duration,
        suggestedPrice: data.suggested_price,
        priceRange: data.price_range
      });

      toast({
        title: "Route Optimized",
        description: `Estimated duration: ${Math.round(data.estimated_duration / 60)} minutes`,
      });
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimize route. Please try again.",
      });
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
