
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
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      setIsEnabled(factors?.totp?.length > 0);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking 2FA status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check 2FA status"
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
        
        if (verifyError) throw verifyError;

        await supabase.from('profiles')
          .update({ two_factor_enabled: true })
          .eq('id', user?.id);

        toast({
          title: "Success",
          description: "Two-factor authentication has been enabled"
        });
        setShowSetup(false);
        setIsEnabled(true);
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
    try {
      const { data, error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      await supabase.from('profiles')
        .update({ two_factor_enabled: false })
        .eq('id', user?.id);

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
              </AlertDescription>
            </Alert>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              className="w-full"
            >
              Disable 2FA
            </Button>
          </>
        ) : (
          <>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>2FA is not enabled</AlertTitle>
              <AlertDescription>
                Enable two-factor authentication for additional security.
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
