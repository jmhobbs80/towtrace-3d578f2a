
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useTwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [isOverwatchAdmin, setIsOverwatchAdmin] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setIsOverwatchAdmin(data?.role === 'overwatch_admin');
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const checkTwoFactorStatus = async () => {
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      setIsEnabled(factors?.totp?.length > 0);
      setIsLoading(false);

      if (isOverwatchAdmin && !factors?.totp?.length) {
        toast({
          variant: "destructive",
          title: "2FA Required",
          description: "As an Overwatch Admin, you must enable two-factor authentication.",
          duration: 0
        });
      }
    } catch (error) {
      console.error("Error checking 2FA status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check 2FA status"
      });
    }
  };

  const generateBackupCodes = async () => {
    try {
      const codes = await Promise.all(
        Array.from({ length: 5 }, async () => {
          const buffer = new Uint8Array(4);
          crypto.getRandomValues(buffer);
          return Array.from(buffer)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
        })
      );
      
      await supabase.from('profiles')
        .update({ two_factor_backup_codes: codes })
        .eq('id', user?.id);

      toast({
        title: "Success",
        description: "New backup codes have been generated. Save them in a secure location."
      });
      return codes;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate backup codes"
      });
      throw error;
    }
  };

  const handleEnable2FA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;
      
      if (data && data.id && data.totp) {
        setFactorId(data.id);
        setQrCodeUrl(data.totp.qr_code);
        setShowSetup(true);
        await generateBackupCodes();
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to enable 2FA"
      });
    }
  };

  const handleVerify = async () => {
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      
      if (challenge) {
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.id,
          code: totpCode
        });
        
        if (verifyError) {
          setFailedAttempts(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              supabase.rpc('log_admin_action', {
                action_type: 'failed_2fa_attempts',
                entity_type: 'auth',
                entity_id: user?.id || '',
                metadata: { attempts: newCount }
              });
            }
            return newCount;
          });
          throw verifyError;
        }

        await supabase.from('profiles')
          .update({ 
            two_factor_enabled: true,
            last_two_factor_verification: new Date().toISOString()
          })
          .eq('id', user?.id);

        await supabase.rpc('log_admin_action', {
          action_type: '2fa_enabled',
          entity_type: 'auth',
          entity_id: user?.id || '',
          metadata: { setup_type: 'totp' }
        });

        toast({
          title: "Success",
          description: "Two-factor authentication has been enabled"
        });
        setShowSetup(false);
        setIsEnabled(true);
        setFailedAttempts(0);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Invalid verification code"
      });
    }
  };

  const handleDisable2FA = async () => {
    if (isOverwatchAdmin) {
      toast({
        variant: "destructive",
        title: "Action Not Allowed",
        description: "Overwatch Admins cannot disable 2FA"
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      await supabase.from('profiles')
        .update({ 
          two_factor_enabled: false,
          two_factor_backup_codes: null 
        })
        .eq('id', user?.id);

      await supabase.rpc('log_admin_action', {
        action_type: '2fa_disabled',
        entity_type: 'auth',
        entity_id: user?.id || ''
      });

      toast({
        title: "Success",
        description: "Two-factor authentication has been disabled"
      });
      setIsEnabled(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disable 2FA"
      });
    }
  };

  useEffect(() => {
    checkTwoFactorStatus();
    checkUserRole();
  }, []);

  return {
    isEnabled,
    isLoading,
    showSetup,
    qrCodeUrl,
    totpCode,
    isOverwatchAdmin,
    setTotpCode,
    handleEnable2FA,
    handleDisable2FA,
    handleVerify
  };
}
