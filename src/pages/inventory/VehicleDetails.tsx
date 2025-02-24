import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Clock, Car, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getVehicleDetails, updateVehicleStatus } from "@/lib/api/vehicles";
import type { VehicleStatus } from "@/lib/types/vehicles";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleDetails(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ vehicleId, status }: { vehicleId: string, status: VehicleStatus }) =>
      updateVehicleStatus(vehicleId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      toast({
        title: "Success",
        description: "Vehicle status updated successfully",
      });
    },
  });

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading vehicle details...</div>;
  }

  if (!vehicle) return null;

  const handleStatusChange = (status: VehicleStatus) => {
    if (id) {
      updateStatusMutation.mutate({ vehicleId: id, status });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
        
        <div className="flex items-center gap-4">
          <Select
            value={vehicle.status}
            onValueChange={(value: VehicleStatus) => handleStatusChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="needs_repair">Needs Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">VIN</dt>
                <dd className="mt-1 font-mono">{vehicle.vin}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Make/Model</dt>
                <dd className="mt-1">{vehicle.make} {vehicle.model}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Year</dt>
                <dd className="mt-1">{vehicle.year}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Badge>{vehicle.status}</Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Inspection</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle.inspections[0] ? (
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1">
                    {format(new Date(vehicle.inspections[0].inspection_date), 'PPP')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <Badge>{vehicle.inspections[0].status}</Badge>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">No inspections recorded</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...vehicle.inspections, ...vehicle.transitHistory, ...vehicle.damageReports]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  {('status' in event && 'inspection_date' in event) ? (
                    <Clock className="w-5 h-5 mt-1" />
                  ) : ('delivery_status' in event) ? (
                    <Car className="w-5 h-5 mt-1" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        {'status' in event && 'inspection_date' in event
                          ? 'Inspection'
                          : 'delivery_status' in event
                          ? 'Transport'
                          : 'Damage Report'}
                      </h4>
                      <time className="text-sm text-gray-500">
                        {format(new Date(event.created_at), 'PPP')}
                      </time>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {'status' in event && 'inspection_date' in event
                        ? `Inspection status: ${event.status}`
                        : 'delivery_status' in event
                        ? `Transport status: ${event.delivery_status}`
                        : `Damage reported: ${(event as any).damage_description}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
