
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "./useUserRole";
import { useTwoFactorVerification } from "./useTwoFactorVerification";
import { useTwoFactorSetup } from "./useTwoFactorSetup";

export function useTwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [factorId, setFactorId] = useState("");
  
  const { user } = useAuth();
  const { isOverwatchAdmin } = useUserRole(user?.id);
  const { handleVerify, failedAttempts } = useTwoFactorVerification(factorId, user?.id);
  const { handleEnable2FA, handleDisable2FA } = useTwoFactorSetup({
    user,
    isOverwatchAdmin,
    setFactorId,
    setQrCodeUrl,
    setShowSetup,
    setIsEnabled
  });

  useEffect(() => {
    const checkTwoFactorStatus = async () => {
      try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        setIsEnabled(factors?.totp?.length > 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking 2FA status:", error);
      }
    };

    checkTwoFactorStatus();
  }, []);

  return {
    isEnabled,
    isLoading,
    showSetup,
    qrCodeUrl,
    totpCode,
    isOverwatchAdmin,
    failedAttempts,
    setTotpCode,
    handleEnable2FA,
    handleDisable2FA,
    handleVerify
  };
}
