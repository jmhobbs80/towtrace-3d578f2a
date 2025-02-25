
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { TwoFactorStatus } from "./components/TwoFactorStatus";
import { useTwoFactorAuth } from "./hooks/useTwoFactorAuth";

export function TwoFactorManager() {
  const {
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
  } = useTwoFactorAuth();

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
        <TwoFactorStatus
          isEnabled={isEnabled}
          isOverwatchAdmin={isOverwatchAdmin}
          onEnable={handleEnable2FA}
          onDisable={handleDisable2FA}
        />
      </CardContent>
    </Card>
  );
}
