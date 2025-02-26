
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
        <div className="space-y-2">
          <p><strong>VIN:</strong> {vin}</p>
          <p><strong>Make:</strong> {make}</p>
          <p><strong>Model:</strong> {model}</p>
          <p><strong>Year:</strong> {year}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Condition:</strong> {condition}</p>
          {location && (
            <p><strong>Location:</strong> {location.name}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
