
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { MailIcon, UserIcon, LockIcon } from "lucide-react";
import { NotificationPreferences } from "./NotificationPreferences";
import { PushNotificationService } from "@/lib/services/push-notifications";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [preferPush, setPreferPush] = useState(false);
  const [preferSMS, setPreferSMS] = useState(false);
  const { toast } = useToast();
  const pushNotificationService = PushNotificationService.getInstance();

  async function setupNotifications() {
    if (preferPush) {
      try {
        await pushNotificationService.subscribe();
        toast({
          title: "Notifications enabled",
          description: "You'll receive updates about new jobs and status changes",
        });
      } catch (error) {
        console.error('Failed to enable notifications:', error);
        toast({
          variant: "destructive",
          title: "Notification setup failed",
          description: "Please enable notifications in your browser settings or choose SMS instead.",
        });
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!email || !password || !firstName || !lastName) {
        throw new Error("Please fill in all required fields");
      }

      if (!preferPush && !preferSMS) {
        throw new Error("Please enable either push notifications or SMS");
      }

      if (preferSMS && !phoneNumber) {
        throw new Error("Phone number is required for SMS notifications");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: preferSMS ? phoneNumber : null,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Set up notifications
      const notificationSetupSuccess = await setupNotifications();
      if (!notificationSetupSuccess && !preferSMS) {
        throw new Error("Failed to set up notifications");
      }

      // Update profile with notification preferences
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          notification_preferences: {
            push_enabled: preferPush,
            sms_enabled: preferSMS
          },
          phone_number: preferSMS ? phoneNumber : null
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <NotificationPreferences
        preferPush={preferPush}
        setPreferPush={setPreferPush}
        preferSMS={preferSMS}
        setPreferSMS={setPreferSMS}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || (!preferPush && !preferSMS)}
      >
        {loading ? "Loading..." : "Create Account"}
      </Button>
    </form>
  );
}
