
export interface NotificationPreferences {
  id: string;
  user_id: string;
  push_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  notification_types: string[];
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}
