
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TruckTracking() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Truck Tracking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Live Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Real-time truck tracking map will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
