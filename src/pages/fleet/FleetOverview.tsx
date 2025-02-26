
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleInspectionForm } from "@/components/inventory/VehicleInspectionForm";

export function FleetOverview() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Overview</h1>
        <Button>Add Vehicle</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Fleet statistics will be displayed here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Active vehicles list will be displayed here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Maintenance status overview will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
