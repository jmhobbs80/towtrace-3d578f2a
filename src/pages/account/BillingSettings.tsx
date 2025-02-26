
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingSettings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Billing Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Billing configuration interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
