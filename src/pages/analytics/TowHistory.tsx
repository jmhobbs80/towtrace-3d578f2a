
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TowHistory() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tow History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historical Tow Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Tow history analytics will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
