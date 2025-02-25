
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FleetVehicle } from "@/lib/types/fleet";

interface VehicleInfoProps {
  vehicle: FleetVehicle;
}

export function VehicleInfo({ vehicle }: VehicleInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Make</p>
            <p>{vehicle.make || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Model</p>
            <p>{vehicle.model || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p>{vehicle.year || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">VIN</p>
            <p>{vehicle.vin || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">License Plate</p>
            <p>{vehicle.license_plate || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="capitalize">{vehicle.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
