import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationMap } from "@/components/map/Map";
import { 
  AreaChart, 
  BarChart, 
  Car, 
  Fuel, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LocationTracker } from "@/components/location/LocationTracker";
import type { FleetVehicle } from "@/lib/types/fleet";

export default function FleetDashboard() {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FleetVehicle[];
    },
    meta: {
      errorMessage: "Failed to load fleet vehicles"
    }
  });

  const activeVehicles = vehicles?.filter(v => v.status === 'active')?.length || 0;
  const maintenanceVehicles = vehicles?.filter(v => v.status === 'maintenance')?.length || 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5 mpg</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            Live Tracking
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <AreaChart className="h-4 w-4 mr-2" />
            Maintenance Trends
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="fuel">
            <BarChart className="h-4 w-4 mr-2" />
            Fuel Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <LocationMap />
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {vehicles?.filter(v => v.status === 'active').map(vehicle => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationTracker enabled={true} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles?.map(vehicle => (
                <div key={vehicle.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">
                      Next maintenance: {vehicle.next_maintenance_date 
                        ? new Date(vehicle.next_maintenance_date).toLocaleDateString()
                        : 'Not scheduled'}
                    </p>
                  </div>
                  {vehicle.status === 'maintenance' && (
                    <span className="text-destructive">In maintenance</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Driver performance scorecards and fleet efficiency metrics will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Usage Analytics Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed fuel consumption tracking and cost analysis will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
