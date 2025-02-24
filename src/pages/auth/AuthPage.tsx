
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PushNotificationService } from "@/lib/services/push-notifications";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [preferPush, setPreferPush] = useState(false);
  const [preferSMS, setPreferSMS] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const pushNotificationService = PushNotificationService.getInstance();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

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

    if (isSignUp && !preferPush && !preferSMS) {
      toast({
        variant: "destructive",
        title: "Notification method required",
        description: "Please enable either push notifications or SMS to continue",
      });
      setLoading(false);
      return;
    }

    if (isSignUp && preferSMS && !phoneNumber) {
      toast({
        variant: "destructive",
        title: "Phone number required",
        description: "Please enter your phone number for SMS notifications",
      });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              phone_number: preferSMS ? phoneNumber : null,
            }
          }
        });
        if (error) throw error;

        // Set up notification preferences
        const notificationSetupSuccess = await setupNotifications();
        if (!notificationSetupSuccess && !preferSMS) {
          throw new Error("Failed to set up notifications");
        }

        // Update profile with notification preferences
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            notification_preferences: {
              push_enabled: preferPush,
              sms_enabled: preferSMS
            },
            phone_number: preferSMS ? phoneNumber : null
          })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (profileError) throw profileError;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      navigate("/");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            {isSignUp && (
              <div className="space-y-4">
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
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (isSignUp && !preferPush && !preferSMS)}
          >
            {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
