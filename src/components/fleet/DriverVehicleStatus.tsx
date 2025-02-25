
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDriverAssignments, getFleetVehicles } from "@/lib/api/fleet";
import { VehicleInfo } from "./VehicleInfo";

interface DriverVehicleStatusProps {
  driverId: string;
}

export function DriverVehicleStatus({ driverId }: DriverVehicleStatusProps) {
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['driver-assignments', driverId],
    queryFn: () => getDriverAssignments(driverId),
  });

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: getFleetVehicles,
  });

  if (isLoadingAssignments || isLoadingVehicles) {
    return <div>Loading assignments...</div>;
  }

  const activeAssignment = assignments?.find(a => a.status === 'active');
  const activeVehicle = vehicles?.find(v => v.id === activeAssignment?.vehicle_id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          {activeAssignment && activeVehicle ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Active Assignment</h3>
                <Badge>Active</Badge>
              </div>
              <VehicleInfo vehicle={activeVehicle} />
            </div>
          ) : (
            <p>No active vehicle assignments</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments?.filter(a => a.status !== 'active')
              .slice(0, 5)
              .map(assignment => {
                const vehicle = vehicles?.find(v => v.id === assignment.vehicle_id);
                if (!vehicle) return null;

                return (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(assignment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{assignment.status}</Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
