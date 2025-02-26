
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VehicleLocation } from "@/lib/api/vehicles";

interface VehicleInfoCardProps {
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string;
  condition: string;
  location: VehicleLocation | null;
}

export function VehicleInfoCard({ 
  vin, 
  make, 
  model, 
  year, 
  status, 
  condition, 
  location 
}: VehicleInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">VIN</p>
            <p className="font-medium break-all">{vin}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Make</p>
            <p className="font-medium">{make}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Model</p>
            <p className="font-medium">{model}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Year</p>
            <p className="font-medium">{year}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Condition</p>
            <p className="font-medium">{condition}</p>
          </div>
          {location && (
            <div className="col-span-full sm:col-span-2 lg:col-span-3">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{location.name}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
