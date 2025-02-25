
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PromoCode {
  id: string;
  code: string;
  type: string;
  description: string;
  trial_days: number;
  max_uses: number;
  times_used: number;
  expires_at: string;
  is_active: boolean;
}

const columns = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "trial_days",
    header: "Trial Days",
  },
  {
    accessorKey: "times_used",
    header: "Times Used",
  },
  {
    accessorKey: "max_uses",
    header: "Max Uses",
  },
  {
    accessorKey: "expires_at",
    header: "Expires At",
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.getValue("expires_at"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }: { row: any }) => (
      <span className={row.getValue("is_active") ? "text-green-500" : "text-red-500"}>
        {row.getValue("is_active") ? "Yes" : "No"}
      </span>
    ),
  },
];

export function BusinessVerification({ 
  autoVerification,
  onToggleAutoVerification,
}: {
  autoVerification: boolean;
  onToggleAutoVerification: (enabled: boolean) => void;
}) {
  const [newCode, setNewCode] = useState("");
  const [trialDays, setTrialDays] = useState("90");
  const [maxUses, setMaxUses] = useState("1000");
  const [expirationDays, setExpirationDays] = useState("365");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { data: promoCodes, refetch } = useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PromoCode[];
    },
  });

  const generateUniqueCode = () => {
    const prefix = "TRIAL";
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    setNewCode(`${prefix}${randomStr}`);
  };

  const createPromoCode = async () => {
    setLoading(true);
    try {
      // Calculate expiration date
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

      // Clear form and refresh data
      setNewCode("");
      refetch();
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

      <Card>
        <CardHeader>
          <CardTitle>Active Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={promoCodes || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
