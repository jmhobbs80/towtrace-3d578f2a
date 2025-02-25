
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, AlertTriangle } from "lucide-react";

interface TwoFactorStatusProps {
  isEnabled: boolean;
  isOverwatchAdmin: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export function TwoFactorStatus({ 
  isEnabled, 
  isOverwatchAdmin, 
  onEnable, 
  onDisable 
}: TwoFactorStatusProps) {
  if (isEnabled) {
    return (
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
            onClick={onDisable}
            className="w-full"
          >
            Disable 2FA
          </Button>
        )}
      </>
    );
  }

  return (
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
        onClick={onEnable}
        className="w-full"
      >
        Enable 2FA
      </Button>
    </>
  );
}
