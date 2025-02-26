
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GpsHistory() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">GPS History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Location History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>GPS tracking history will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
