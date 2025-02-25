
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationPreferences } from "@/components/auth/NotificationPreferences";
import { Bell } from "lucide-react";

export default function NotificationCenter() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Bell className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Notification Center</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationPreferences />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new notifications</p>
        </CardContent>
      </Card>
    </div>
  );
}
