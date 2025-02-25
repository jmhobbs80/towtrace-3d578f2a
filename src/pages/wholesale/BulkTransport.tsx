import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoadTable } from "@/components/transport/LoadTable";
import { supabase } from "@/integrations/supabase/client";
import type { Load } from "@/lib/types/load";
import { parseLocation, isValidLoadStatus, isDimensions, isPriceRange } from "@/lib/types/load";
import { useToast } from "@/components/ui/use-toast";

export default function BulkTransport() {
  const { organization } = useAuth();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const { data: loads = [], isLoading } = useQuery({
    queryKey: ['bulk-transport-loads', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('load_type', 'vehicle')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((load): Load => {
        const status = isValidLoadStatus(load.status) ? load.status : 'open';
        
        return {
          ...load,
          pickup_location: parseLocation(load.pickup_location),
          delivery_location: parseLocation(load.delivery_location),
          status,
          requirements: Array.isArray(load.requirements) 
            ? load.requirements.map(r => String(r))
            : [],
          photos: Array.isArray(load.photos) 
            ? load.photos.map(p => String(p))
            : [],
          dimensions: isDimensions(load.dimensions) ? load.dimensions : undefined,
          price_range: isPriceRange(load.price_range) ? load.price_range : undefined,
          weight: typeof load.weight === 'number' ? load.weight : undefined
        };
      });
    },
    enabled: !!organization?.id,
  });

  const handleOptimize = async (load: Load) => {
    setIsOptimizing(true);
    try {
      // Implement route optimization logic here
      console.log('Optimizing bulk transport route for load:', load.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bulk Transport</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Bulk Transport
        </Button>
      </div>

      {isLoading ? (
        <div>Loading bulk transport requests...</div>
      ) : (
        <LoadTable
          loads={loads}
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
        />
      )}
    </div>
  );
}
