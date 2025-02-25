
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { CarFront, Wrench, Truck, Gavel } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InventoryStats {
  total: number;
  in_transit: number;
  pending_repair: number;
  transport_jobs: number;
}

export function DealerDashboard() {
  const { organization } = useAuth();
  
  const { data: stats = { total: 0, in_transit: 0, pending_repair: 0, transport_jobs: 0 }, isLoading } = useQuery({
    queryKey: ['inventory-stats', organization?.id],
    queryFn: async () => {
      const [inventoryResponse, transitResponse, repairResponse, transportResponse] = await Promise.all([
        supabase
          .from('inventory_vehicles')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization?.id),
        
        supabase
          .from('inventory_vehicles')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization?.id)
          .eq('status', 'in_transit'),

        supabase
          .from('inventory_vehicles')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization?.id)
          .eq('status', 'pending_repair'),

        supabase
          .from('tow_jobs')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization?.id)
          .in('status', ['pending', 'in_progress'])
      ]);

      return {
        total: inventoryResponse.count || 0,
        in_transit: transitResponse.count || 0,
        pending_repair: repairResponse.count || 0,
        transport_jobs: transportResponse.count || 0
      };
    },
    enabled: !!organization?.id
  });

  if (!organization) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome to {organization?.name}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory
            </CardTitle>
            <CarFront className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total vehicles in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.in_transit}</div>
            <p className="text-xs text-muted-foreground">
              Vehicles being transported
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Repairs
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_repair}</div>
            <p className="text-xs text-muted-foreground">
              Vehicles awaiting service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transport Jobs
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transport_jobs}</div>
            <p className="text-xs text-muted-foreground">
              Active transport requests
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
