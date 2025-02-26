
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FleetEfficiency() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Fleet Efficiency</h1>
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fleet efficiency analytics will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
