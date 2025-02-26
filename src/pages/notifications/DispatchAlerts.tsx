
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DispatchAlerts() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dispatch Alerts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dispatch alerts will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
