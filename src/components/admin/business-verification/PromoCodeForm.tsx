
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromoCodeFormProps {
  onSuccess: () => void;
}

export function PromoCodeForm({ onSuccess }: PromoCodeFormProps) {
  const [newCode, setNewCode] = useState("");
  const [trialDays, setTrialDays] = useState("90");
  const [maxUses, setMaxUses] = useState("1000");
  const [expirationDays, setExpirationDays] = useState("365");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const generateUniqueCode = () => {
    // Using timestamp + random for better uniqueness
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    const prefix = "TRIAL";
    setNewCode(`${prefix}${timestamp.slice(-3)}${randomPart}`);
  };

  const createPromoCode = async () => {
    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expirationDays));

      const { error } = await supabase.from("promo_codes").insert({
        code: newCode,
        type: "trial",
        description: `${trialDays}-day free trial`,
        trial_days: parseInt(trialDays),
        max_uses: parseInt(maxUses),
        expires_at: expiresAt.toISOString(),
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Promo code created",
        description: `Successfully created promo code: ${newCode}`,
      });

      setNewCode("");
      onSuccess();
    } catch (error) {
      console.error("Error creating promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create promo code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Promo Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="promoCode">Promo Code</Label>
            <div className="flex space-x-2">
              <Input
                id="promoCode"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
              />
              <Button onClick={generateUniqueCode} variant="outline">
                Generate
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trialDays">Trial Days</Label>
            <Input
              id="trialDays"
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUses">Max Uses</Label>
            <Input
              id="maxUses"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expirationDays">Code Valid For (Days)</Label>
            <Input
              id="expirationDays"
              type="number"
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value)}
            />
          </div>
        </div>
        <Button 
          onClick={createPromoCode} 
          className="mt-4"
          disabled={loading || !newCode || !trialDays || !maxUses || !expirationDays}
        >
          {loading ? "Creating..." : "Create Promo Code"}
        </Button>
      </CardContent>
    </Card>
  );
}
