
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationCenter() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Notification list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
