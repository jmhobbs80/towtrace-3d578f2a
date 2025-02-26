
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Subscription management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
