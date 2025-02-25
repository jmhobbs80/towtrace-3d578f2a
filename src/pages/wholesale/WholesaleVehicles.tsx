
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { InventoryList } from "@/components/inventory/InventoryList";
import { supabase } from "@/integrations/supabase/client";

export default function WholesaleVehicles() {
  const { organization } = useAuth();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['wholesale-vehicles', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_vehicles')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wholesale Vehicles</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <InventoryList
        vehicles={vehicles}
        isLoading={isLoading}
      />
    </div>
  );
}
