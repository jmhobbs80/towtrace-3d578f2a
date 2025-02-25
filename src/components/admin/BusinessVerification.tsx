
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { PromoCodeForm } from "./business-verification/PromoCodeForm";
import { PromoCodeTable } from "./business-verification/PromoCodeTable";

export function BusinessVerification({ 
  autoVerification,
  onToggleAutoVerification,
}: {
  autoVerification: boolean;
  onToggleAutoVerification: (enabled: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const handlePromoCodeCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Trial Management</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-verification">Auto Verification</Label>
          <Switch
            id="auto-verification"
            checked={autoVerification}
            onCheckedChange={onToggleAutoVerification}
          />
        </div>
      </div>

      <PromoCodeForm onSuccess={handlePromoCodeCreated} />
      <PromoCodeTable />
    </div>
  );
}
