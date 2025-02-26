
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Billing Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Billing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Billing management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
