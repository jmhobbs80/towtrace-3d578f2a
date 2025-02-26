
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleDetailsProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  status: string;
  impoundDate: string;
  releaseDate?: string | null;
}

export function VehicleDetailsCard({ vehicle, status, impoundDate, releaseDate }: VehicleDetailsProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      impounded: "bg-red-500",
      waiting_for_payment: "bg-yellow-500",
      pending_release: "bg-blue-500",
      released: "bg-green-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Vehicle Details</span>
          <Badge className={`${getStatusColor(status)} text-white`}>
            {status.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Vehicle Information</h3>
            <p className="text-gray-600">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-gray-600">VIN: {vehicle.vin}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Impound Details</h3>
            <p className="text-gray-600">
              Impounded on: {new Date(impoundDate).toLocaleDateString()}
            </p>
            {releaseDate && (
              <p className="text-gray-600">
                Released on: {new Date(releaseDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
