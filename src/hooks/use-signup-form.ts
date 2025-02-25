
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PushNotificationService } from "@/lib/services/push-notifications";
import type { UserRole } from "@/lib/types/auth";

export function useSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRole>("driver");
  const [loading, setLoading] = useState(false);
  const [preferPush, setPreferPush] = useState(false);
  const [preferSMS, setPreferSMS] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeValid, setPromoCodeValid] = useState<boolean | null>(null);
  const [promoCodeMessage, setPromoCodeMessage] = useState("");
  const { toast } = useToast();
  const pushNotificationService = PushNotificationService.getInstance();

  async function validatePromoCode() {
    if (!promoCode) {
      setPromoCodeValid(null);
      setPromoCodeMessage("");
      return null;
    }

    const { data, error } = await supabase.rpc('validate_promo_code', {
      code_input: promoCode,
      user_id_input: await supabase.auth.getUser().then(({ data }) => data.user?.id)
    });

    if (error) {
      setPromoCodeValid(false);
      setPromoCodeMessage("Error validating promo code");
      return null;
    }

    const validation = data[0];
    setPromoCodeValid(validation.is_valid);
    setPromoCodeMessage(validation.message);
    return validation;
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
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

      // Validate promo code if provided
      let promoValidation = null;
      if (promoCode) {
        promoValidation = await validatePromoCode();
        if (!promoValidation?.is_valid) {
          throw new Error("Invalid promo code");
        }
      }

      // Sign up
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
            promo_code: promoValidation?.is_valid ? promoCode : null
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
        .eq('id', signUpData.user?.id);

      if (profileError) throw profileError;

      // Record promo code redemption if valid
      if (promoValidation?.is_valid && signUpData.user) {
        const { error: redemptionError } = await supabase
          .from('promo_code_redemptions')
          .insert({
            user_id: signUpData.user.id,
            organization_id: signUpData.user.user_metadata.current_organization_id,
            promo_code_id: promoCode
          });

        if (redemptionError) {
          console.error('Error recording promo code redemption:', redemptionError);
        }
      }

      toast({
        title: "Account created successfully",
        description: promoValidation?.is_valid 
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
    handleSubmit
  };
}
