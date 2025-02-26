
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebhookSettings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Webhook Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Webhook configuration interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
