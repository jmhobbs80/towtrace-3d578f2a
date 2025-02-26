
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddVehicle() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add Vehicle</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Add vehicle form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
