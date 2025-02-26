
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DriverPerformance() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Driver Performance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Driver performance metrics will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
