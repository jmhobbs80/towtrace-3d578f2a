
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VehiclesList() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Vehicles List</h1>
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vehicle list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
