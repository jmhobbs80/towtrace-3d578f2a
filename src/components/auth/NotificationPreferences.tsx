
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PhoneIcon } from "lucide-react";

interface NotificationPreferencesProps {
  preferPush: boolean;
  setPreferPush: (value: boolean) => void;
  preferSMS: boolean;
  setPreferSMS: (value: boolean) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

export function NotificationPreferences({
  preferPush,
  setPreferPush,
  preferSMS,
  setPreferSMS,
  phoneNumber,
  setPhoneNumber,
}: NotificationPreferencesProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Notification Preferences (Required)</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push"
              checked={preferPush}
              onCheckedChange={(checked) => setPreferPush(checked === true)}
            />
            <Label htmlFor="push">Enable Push Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms"
              checked={preferSMS}
              onCheckedChange={(checked) => setPreferSMS(checked === true)}
            />
            <Label htmlFor="sms">Enable SMS Notifications</Label>
          </div>
        </div>
      </div>

      {preferSMS && (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
    </>
  );
}
