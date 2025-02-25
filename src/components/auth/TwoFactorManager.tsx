
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Key, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { TwoFactorSetup } from "./TwoFactorSetup";

export function TwoFactorManager() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [isOverwatchAdmin, setIsOverwatchAdmin] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkTwoFactorStatus();
    checkUserRole();
  }, []);

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

      // Show warning for Overwatch Admins without 2FA
      if (isOverwatchAdmin && !factors?.totp?.length) {
        toast({
          variant: "destructive",
          title: "2FA Required",
          description: "As an Overwatch Admin, you must enable two-factor authentication.",
          duration: 0 // Non-dismissible
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
      const codes = Array.from({ length: 5 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      
      await supabase.from('profiles')
        .update({ two_factor_backup_codes: codes })
        .eq('id', user?.id);

      setBackupCodes(codes);
      toast({
        title: "Success",
        description: "New backup codes have been generated. Save them in a secure location."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate backup codes"
      });
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

        // Log successful 2FA setup
        await supabase.rpc('log_admin_action', {
          action_type: '2fa_enabled',
          entity_type: 'auth',
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

      // Log 2FA disabled
      await supabase.rpc('log_admin_action', {
        action_type: '2fa_disabled',
        entity_type: 'auth'
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (showSetup) {
    return (
      <TwoFactorSetup
        qrCodeUrl={qrCodeUrl}
        totpCode={totpCode}
        onTotpCodeChange={setTotpCode}
        onVerify={handleVerify}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Two-Factor Authentication (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <>
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>2FA is enabled</AlertTitle>
              <AlertDescription>
                Your account is protected with two-factor authentication.
                {isOverwatchAdmin && " This is required for your role."}
              </AlertDescription>
            </Alert>
            {!isOverwatchAdmin && (
              <Button
                variant="destructive"
                onClick={handleDisable2FA}
                className="w-full"
              >
                Disable 2FA
              </Button>
            )}
          </>
        ) : (
          <>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>2FA is not enabled</AlertTitle>
              <AlertDescription>
                {isOverwatchAdmin 
                  ? "As an Overwatch Admin, you must enable two-factor authentication to continue."
                  : "Enable two-factor authentication for additional security."}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleEnable2FA}
              className="w-full"
            >
              Enable 2FA
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
