
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
import { getVehiclesInTransit } from "@/lib/api/fleet";
import type { VehicleInTransit } from "@/lib/types/fleet";

const VehiclesInTransitDashboard = () => {
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleInTransit | null>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles-in-transit'],
    queryFn: async () => {
      const { data: jobs, error: jobsError } = await supabase
        .from('tow_jobs')
        .select('id');

      if (jobsError) throw jobsError;

      const jobIds = jobs.map(job => job.id);
      const allVehicles: VehicleInTransit[] = [];
      
      for (const jobId of jobIds) {
        const vehiclesForJob = await getVehiclesInTransit(jobId);
        allVehicles.push(...vehiclesForJob);
      }

      return allVehicles;
    }
  });

  const getPickupStatusColor = (status: VehicleInTransit['pickup_status']) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getDeliveryStatusColor = (status: VehicleInTransit['delivery_status']) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'in_transit':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading vehicles in transit...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Vehicles in Transit</h1>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle Info</TableHead>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Pickup Status</TableHead>
                  <TableHead>Delivery Status</TableHead>
                  <TableHead>Pickup Confirmation</TableHead>
                  <TableHead>Delivery Confirmation</TableHead>
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
                          VIN: {vehicle.vin}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{vehicle.job_id.slice(0, 8)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPickupStatusColor(vehicle.pickup_status)}>
                        {vehicle.pickup_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDeliveryStatusColor(vehicle.delivery_status)}>
                        {vehicle.delivery_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.pickup_confirmation
                        ? new Date(vehicle.pickup_confirmation).toLocaleDateString()
                        : 'Pending'}
                    </TableCell>
                    <TableCell>
                      {vehicle.delivery_confirmation
                        ? new Date(vehicle.delivery_confirmation).toLocaleDateString()
                        : 'Pending'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        Update Status
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

export default VehiclesInTransitDashboard;
