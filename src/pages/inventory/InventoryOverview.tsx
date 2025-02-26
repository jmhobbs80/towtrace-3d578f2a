
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InventoryOverview() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Inventory Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Inventory overview will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
