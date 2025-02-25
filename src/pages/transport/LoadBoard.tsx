import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import type { Load, Dimensions, PriceRange } from "@/lib/types/load";
import { CreateLoadDialog } from "@/components/transport/CreateLoadDialog";
import { LocationMap } from "@/components/map/Map";
import { LoadTable } from "@/components/transport/LoadTable";
import { parseLocation, isValidLoadStatus } from "@/lib/types/load";

function isDimensions(value: unknown): value is Dimensions {
  if (!value || typeof value !== 'object') return false;
  const dims = value as Partial<Dimensions>;
  return typeof dims.length === 'number' 
    && typeof dims.width === 'number' 
    && typeof dims.height === 'number' 
    && (dims.unit === 'ft' || dims.unit === 'm');
}

function isPriceRange(value: unknown): value is PriceRange {
  if (!value || typeof value !== 'object') return false;
  const range = value as Partial<PriceRange>;
  return typeof range.min === 'number' && typeof range.max === 'number';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export default function LoadBoard() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { data: loads, isLoading } = useQuery({
    queryKey: ["loads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching loads",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data.map((load): Load => {
        const status = isValidLoadStatus(load.status) ? load.status : 'open';
        
        return {
          ...load,
          pickup_location: parseLocation(load.pickup_location),
          delivery_location: parseLocation(load.delivery_location),
          status,
          requirements: isStringArray(load.requirements) ? load.requirements : [],
          photos: isStringArray(load.photos) ? load.photos : [],
          dimensions: isDimensions(load.dimensions) ? load.dimensions : undefined,
          weight: typeof load.weight === 'number' ? load.weight : undefined,
          price_range: isPriceRange(load.price_range) ? load.price_range : undefined,
          assigned_to: load.assigned_to || undefined,
          description: load.description || undefined
        };
      });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("loads-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loads",
        },
        (payload) => {
          console.log("Load change received!", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOptimizeRoute = async (load: Load) => {
    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-route', {
        body: {
          pickupLocation: load.pickup_location,
          deliveryLocation: load.delivery_location,
          constraints: {
            maxDrivingHours: 11, // DOT regulations
            avoidHighways: false,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Route Optimized",
        description: `Estimated delivery time: ${format(new Date(data.route.stops[1].estimatedArrival), "PPp")}`,
      });

      setSelectedLoad(load);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Route optimization failed",
        description: error.message,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading loads...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Load Board</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Post Load</Button>
          </div>

          {selectedLoad && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Route Visualization</h2>
              <LocationMap
                initialCenter={[
                  selectedLoad.pickup_location.coordinates?.[0] || -95.7129,
                  selectedLoad.pickup_location.coordinates?.[1] || 37.0902
                ]}
                initialZoom={6}
              />
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <LoadTable
              loads={loads || []}
              onOptimize={handleOptimizeRoute}
              isOptimizing={isOptimizing}
            />
          </div>
        </div>
      </main>

      <CreateLoadDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
