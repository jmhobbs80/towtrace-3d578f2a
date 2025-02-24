
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { FleetVehicle } from "@/lib/types/fleet";

const FleetManagement = () => {
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching vehicles",
          description: error.message
        });
        throw error;
      }

      return data as FleetVehicle[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'assigned':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading fleet...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
            <Button>Add Vehicle</Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle Info</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles?.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {vehicle.make} {vehicle.model} {vehicle.year}
                        </div>
                        <div className="text-sm text-gray-500">
                          VIN: {vehicle.vin || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          License: {vehicle.license_plate || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.vehicle_type}</TableCell>
                    <TableCell>{vehicle.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.last_maintenance_date
                        ? new Date(vehicle.last_maintenance_date).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {vehicle.next_maintenance_date
                        ? new Date(vehicle.next_maintenance_date).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FleetManagement;
