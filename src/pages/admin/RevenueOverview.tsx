
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RevenueOverview() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Revenue Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Revenue analytics dashboard will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
