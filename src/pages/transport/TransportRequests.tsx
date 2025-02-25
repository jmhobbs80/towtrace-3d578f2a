
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadTable } from "@/components/transport/LoadTable";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { Load } from "@/lib/types/load";

export default function TransportRequests() {
  const { organization } = useAuth();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { data: loads = [], isLoading } = useQuery({
    queryKey: ['transport-loads', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((load): Load => ({
        ...load,
        pickup_location: {
          address: load.pickup_location.address,
          coordinates: load.pickup_location.coordinates
        },
        delivery_location: {
          address: load.delivery_location.address,
          coordinates: load.delivery_location.coordinates
        }
      }));
    },
    enabled: !!organization?.id,
  });

  const handleOptimize = async (load: Load) => {
    setIsOptimizing(true);
    try {
      // Implement route optimization logic here
      console.log('Optimizing route for load:', load.id);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transport Requests</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Transport Request
        </Button>
      </div>

      {isLoading ? (
        <div>Loading transport requests...</div>
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
