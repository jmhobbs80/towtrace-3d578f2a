
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VehicleInspections() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Vehicle Inspections</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inspection Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vehicle inspection records will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
