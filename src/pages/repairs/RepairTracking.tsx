
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RepairOrderCard } from "@/components/repair/RepairOrderCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function RepairTracking() {
  const { organization } = useAuth();
  const navigate = useNavigate();

  const { data: repairOrders, isLoading } = useQuery({
    queryKey: ['repair-orders', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_orders')
        .select(`
          *,
          facility:repair_facilities(*),
          items:repair_items(*)
        `)
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
        <h1 className="text-2xl font-bold">Repair Tracking</h1>
        <Button onClick={() => navigate("/repairs/create")}>
          <Plus className="w-4 h-4 mr-2" />
          New Repair Order
        </Button>
      </div>

      {isLoading ? (
        <div>Loading repair orders...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repairOrders?.map((order) => (
            <RepairOrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
}
