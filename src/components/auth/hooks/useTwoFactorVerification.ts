import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTwoFactorVerification(factorId: string, userId?: string) {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { toast } = useToast();

  const handleVerify = async (totpCode: string) => {
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
                entity_id: userId || '',
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
          .eq('id', userId);

        await supabase.rpc('log_admin_action', {
          action_type: '2fa_enabled',
          entity_type: 'auth',
          entity_id: userId || '',
          metadata: { setup_type: 'totp' }
        });

        toast({
          title: "Success",
          description: "Two-factor authentication has been enabled"
        });
        setFailedAttempts(0);
        return true;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Invalid verification code"
      });
      return false;
    }
  };

  return { handleVerify, failedAttempts };
}
