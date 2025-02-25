
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getFleetVehicles,
  assignVehicleToDriver,
  completeVehicleAssignment,
  getActiveAssignment
} from "@/lib/api/fleet";
import { VehicleInfo } from "./VehicleInfo";
import { VehicleAssignmentCard } from "./VehicleAssignmentCard";
import { PreTripInspectionForm } from "./PreTripInspectionForm";
import { PostTripInspectionForm } from "./PostTripInspectionForm";

interface VehicleAssignmentManagerProps {
  vehicleId: string;
  driverId: string;
}

export function VehicleAssignmentManager({ vehicleId, driverId }: VehicleAssignmentManagerProps) {
  const { toast } = useToast();
  const [showPreTrip, setShowPreTrip] = useState(false);
  const [showPostTrip, setShowPostTrip] = useState(false);

  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['fleet-vehicle', vehicleId],
    queryFn: async () => {
      const vehicles = await getFleetVehicles();
      return vehicles.find(v => v.id === vehicleId);
    },
  });

  const { data: activeAssignment, isLoading: isLoadingAssignment } = useQuery({
    queryKey: ['active-assignment', vehicleId],
    queryFn: () => getActiveAssignment(vehicleId),
  });

  const assignMutation = useMutation({
    mutationFn: () => assignVehicleToDriver(vehicleId, driverId),
    onSuccess: () => {
      toast({
        title: "Vehicle Assigned",
        description: "You can now start the pre-trip inspection",
      });
      setShowPreTrip(true);
    },
  });

  const completeMutation = useMutation({
    mutationFn: (assignmentId: string) => completeVehicleAssignment(assignmentId),
    onSuccess: () => {
      toast({
        title: "Assignment Completed",
        description: "Vehicle has been successfully returned",
      });
      setShowPostTrip(false);
    },
  });

  if (isLoadingVehicle || isLoadingAssignment) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div className="space-y-6">
      <VehicleInfo vehicle={vehicle} />
      
      {!activeAssignment && !showPreTrip && (
        <Button 
          onClick={() => assignMutation.mutate()}
          disabled={assignMutation.isPending}
        >
          Assign Vehicle
        </Button>
      )}

      {activeAssignment && (
        <VehicleAssignmentCard
          assignment={activeAssignment}
          onComplete={() => {
            setShowPostTrip(true);
            completeMutation.mutate(activeAssignment.id);
          }}
        />
      )}

      {showPreTrip && !activeAssignment && (
        <PreTripInspectionForm
          vehicleId={vehicleId}
          onComplete={() => setShowPreTrip(false)}
        />
      )}

      {showPostTrip && (
        <PostTripInspectionForm
          vehicleId={vehicleId}
          assignmentId={activeAssignment?.id || ""}
          onComplete={() => setShowPostTrip(false)}
        />
      )}
    </div>
  );
}
