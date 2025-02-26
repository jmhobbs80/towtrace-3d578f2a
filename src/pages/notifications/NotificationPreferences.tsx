
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationPreferences() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Notification Preferences</h1>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Notification preferences will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
