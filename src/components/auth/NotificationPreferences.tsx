
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneIcon, Bell, Mail, MessageSquare } from "lucide-react";
import { PushNotificationService } from "@/lib/services/push-notifications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPreferences {
  push_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  notification_types: string[];
  phone_number: string | null;
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_enabled: false,
    sms_enabled: false,
    email_enabled: false,
    notification_types: ['jobs', 'billing', 'system'],
    phone_number: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const pushService = PushNotificationService.getInstance();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = async (updates: Partial<NotificationPreferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);

      await pushService.updateNotificationPreferences({
        push: newPreferences.push_enabled,
        sms: newPreferences.sms_enabled,
        email: newPreferences.email_enabled,
        types: newPreferences.notification_types,
        phone: newPreferences.phone_number || undefined
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences."
      });
    }
  };

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Notification Methods</Label>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="push"
            checked={preferences.push_enabled}
            onCheckedChange={(checked) => 
              handlePreferenceChange({ push_enabled: checked === true })
            }
          />
          <Label htmlFor="push" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Push Notifications
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="email"
            checked={preferences.email_enabled}
            onCheckedChange={(checked) => 
              handlePreferenceChange({ email_enabled: checked === true })
            }
          />
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sms"
            checked={preferences.sms_enabled}
            onCheckedChange={(checked) => 
              handlePreferenceChange({ sms_enabled: checked === true })
            }
          />
          <Label htmlFor="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS Notifications
          </Label>
        </div>
      </div>

      {preferences.sms_enabled && (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number for SMS</Label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={preferences.phone_number || ''}
              onChange={(e) => handlePreferenceChange({ phone_number: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Notification Types</Label>
        
        <div className="space-y-2">
          {[
            { id: 'jobs', label: 'Job Assignments & Updates' },
            { id: 'billing', label: 'Billing & Payments' },
            { id: 'system', label: 'System Alerts' },
            { id: 'maintenance', label: 'Maintenance Alerts' }
          ].map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={preferences.notification_types.includes(type.id)}
                onCheckedChange={(checked) => {
                  const types = checked
                    ? [...preferences.notification_types, type.id]
                    : preferences.notification_types.filter(t => t !== type.id);
                  handlePreferenceChange({ notification_types: types });
                }}
              />
              <Label htmlFor={type.id}>{type.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => pushService.sendTestNotification()}
      >
        Send Test Notification
      </Button>
    </div>
  );
}
