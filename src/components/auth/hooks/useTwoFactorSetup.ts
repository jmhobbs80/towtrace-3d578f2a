
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UseTwoFactorSetupProps {
  user: User | null;
  isOverwatchAdmin: boolean;
  setFactorId: (id: string) => void;
  setQrCodeUrl: (url: string) => void;
  setShowSetup: (show: boolean) => void;
  setIsEnabled: (enabled: boolean) => void;
}

export function useTwoFactorSetup({
  user,
  isOverwatchAdmin,
  setFactorId,
  setQrCodeUrl,
  setShowSetup,
  setIsEnabled
}: UseTwoFactorSetupProps) {
  const { toast } = useToast();

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
      
      if (data?.id && data?.totp?.qr_code) {
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
      const { error } = await supabase.auth.mfa.unenroll({ factorId: '' });
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

  return { handleEnable2FA, handleDisable2FA };
}
