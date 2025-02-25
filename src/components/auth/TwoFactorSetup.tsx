
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TwoFactorSetupProps {
  qrCodeUrl: string;
  totpCode: string;
  onTotpCodeChange: (code: string) => void;
  onVerify: () => void;
}

export function TwoFactorSetup({ 
  qrCodeUrl, 
  totpCode, 
  onTotpCodeChange, 
  onVerify 
}: TwoFactorSetupProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#1A1F2C]">Set up Two-Factor Authentication</h3>
        <p className="text-sm text-[#7E69AB] mt-2">
          Scan the QR code with your authenticator app
        </p>
      </div>
      
      <div className="flex justify-center">
        <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 shadow-md rounded-lg" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="totpCode" className="text-[#1A1F2C]">Enter verification code</Label>
          <Input
            id="totpCode"
            value={totpCode}
            onChange={(e) => onTotpCodeChange(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center tracking-widest text-lg border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5]"
          />
        </div>
        <Button
          onClick={onVerify}
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors"
        >
          Verify and Enable 2FA
        </Button>
      </div>
    </div>
  );
}
