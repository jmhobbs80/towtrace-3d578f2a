
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationPreferences } from "@/components/auth/NotificationPreferences";
import { Bell } from "lucide-react";

export default function NotificationCenter() {
  const [notifications] = useState([]);
  const [preferPush, setPreferPush] = useState(false);
  const [preferSMS, setPreferSMS] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

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
          <NotificationPreferences 
            preferPush={preferPush}
            setPreferPush={setPreferPush}
            preferSMS={preferSMS}
            setPreferSMS={setPreferSMS}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground">No new notifications</p>
          ) : (
            <div className="space-y-4">
              {/* Notification list will be implemented here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
