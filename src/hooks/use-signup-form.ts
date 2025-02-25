import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PushNotificationService } from "@/lib/services/push-notifications";
import type { UserRole } from "@/lib/types/auth";

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 25;
  
  // Contains number
  if (/\d/.test(password)) strength += 25;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 25;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 15;
  
  // Contains special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
  
  return Math.min(100, strength);
};

export function useSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRole>("provider");
  const [loading, setLoading] = useState(false);
  const [preferPush, setPreferPush] = useState(false);
  const [preferSMS, setPreferSMS] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeValid, setPromoCodeValid] = useState<boolean | null>(null);
  const [promoCodeMessage, setPromoCodeMessage] = useState("");
  const { toast } = useToast();
  const pushNotificationService = PushNotificationService.getInstance();

  const passwordStrength = calculatePasswordStrength(password);

  async function validatePromoCode() {
    if (!promoCode) {
      setPromoCodeValid(null);
      setPromoCodeMessage("");
      return null;
    }

    const { data: promoData, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode)
      .eq('is_active', true)
      .maybeSingle();

    if (promoError || !promoData) {
      setPromoCodeValid(false);
      setPromoCodeMessage("Invalid or expired promo code");
      return null;
    }

    if (promoData.max_uses && promoData.times_used >= promoData.max_uses) {
      setPromoCodeValid(false);
      setPromoCodeMessage("This promo code has reached its usage limit");
      return null;
    }

    if (promoData.expires_at && new Date(promoData.expires_at) < new Date()) {
      setPromoCodeValid(false);
      setPromoCodeMessage("This promo code has expired");
      return null;
    }

    setPromoCodeValid(true);
    setPromoCodeMessage("Valid promo code - 90 day trial will be activated");
    return promoData;
  }

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

  const validateSignUpData = () => {
    if (!email || !password || !firstName || !lastName || !role || !companyName) {
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
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      validateSignUpData();

      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: preferSMS ? phoneNumber : null,
            role: role,
            company_name: companyName,
            promo_code: promoCodeValid ? promoCode : null
          }
        }
      });

      if (signUpError) throw signUpError;

      const notificationSetupSuccess = await setupNotifications();
      if (!notificationSetupSuccess && !preferSMS) {
        throw new Error("Failed to set up notifications");
      }

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
        .eq('id', signUpData.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Account created successfully",
        description: promoCodeValid 
          ? "Your 90-day trial has been activated! Please check your email to verify your account."
          : "Please check your email to verify your account",
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    role,
    setRole,
    loading,
    preferPush,
    setPreferPush,
    preferSMS,
    setPreferSMS,
    companyName,
    setCompanyName,
    promoCode,
    setPromoCode,
    promoCodeValid,
    promoCodeMessage,
    validatePromoCode,
    handleSubmit,
    passwordStrength
  };
}
