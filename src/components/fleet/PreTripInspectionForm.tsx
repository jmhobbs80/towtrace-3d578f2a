
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFleetVehicles } from "@/lib/api/fleet";
import { VehicleInspectionForm } from "@/components/inventory/VehicleInspectionForm";
import { VehicleInfo } from "./VehicleInfo";

interface PreTripInspectionFormProps {
  vehicleId: string;
  onComplete?: () => void;
}

export function PreTripInspectionForm({ vehicleId, onComplete }: PreTripInspectionFormProps) {
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['fleet-vehicle', vehicleId],
    queryFn: async () => {
      const vehicles = await getFleetVehicles();
      return vehicles.find(v => v.id === vehicleId);
    },
  });

  if (isLoading || !vehicle) {
    return <div>Loading vehicle information...</div>;
  }

  return (
    <div className="space-y-6">
      <VehicleInfo vehicle={vehicle} />
      <Card>
        <CardHeader>
          <CardTitle>Pre-Trip Inspection</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleInspectionForm
            vehicleId={vehicleId}
            onComplete={onComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
