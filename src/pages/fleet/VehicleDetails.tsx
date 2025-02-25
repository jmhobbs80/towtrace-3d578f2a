
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FleetVehicle } from "@/lib/types/fleet";

export default function VehicleDetails() {
  const { vehicleId } = useParams();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
      
      if (error) throw error;
      return data as FleetVehicle;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Vehicle Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Vehicle Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Make</p>
              <p className="font-medium">{vehicle.make || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-medium">{vehicle.model || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{vehicle.year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">License Plate</p>
              <p className="font-medium">{vehicle.license_plate || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VIN</p>
              <p className="font-medium">{vehicle.vin || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{vehicle.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Last Maintenance</p>
                <p className="font-medium">
                  {vehicle.last_maintenance_date 
                    ? new Date(vehicle.last_maintenance_date).toLocaleDateString()
                    : 'No maintenance record'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Scheduled Maintenance</p>
                <p className="font-medium">
                  {vehicle.next_maintenance_date
                    ? new Date(vehicle.next_maintenance_date).toLocaleDateString()
                    : 'Not scheduled'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
