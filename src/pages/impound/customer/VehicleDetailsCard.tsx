
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleDetailsCardProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  status: string;
  impoundDate: string;
  releaseDate: string | null;
}

export function VehicleDetailsCard({ vehicle, status, impoundDate, releaseDate }: VehicleDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Vehicle:</span>
            <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">VIN:</span>
            <span>{vehicle.vin}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Impound Date:</span>
            <span>{new Date(impoundDate).toLocaleDateString()}</span>
          </div>
          {releaseDate && (
            <div className="flex justify-between">
              <span className="font-semibold">Release Date:</span>
              <span>{new Date(releaseDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
