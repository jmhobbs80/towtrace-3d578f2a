
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { OrganizationRow } from "@/lib/types/billing";

interface BillingExemptionManagerProps {
  readonly organizationId: string;
  readonly initialExemptStatus: boolean;
  readonly organizationName: string;
}

export function BillingExemptionManager({ 
  organizationId, 
  initialExemptStatus,
  organizationName 
}: BillingExemptionManagerProps) {
  const [isExempt, setIsExempt] = useState(initialExemptStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleExemption = async () => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      const newStatus = !isExempt;
      
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ billing_exempt: newStatus } as Partial<OrganizationRow>)
        .eq('id', organizationId);
      
      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from('admin_audit_logs')
        .insert({
          user_id: user.id,
          action_type: newStatus ? 'billing_exemption_enabled' : 'billing_exemption_disabled',
          entity_type: 'organization',
          entity_id: organizationId,
          metadata: {
            organization_name: organizationName,
            previous_status: isExempt,
            new_status: newStatus
          }
        });

      if (logError) throw logError;

      setIsExempt(newStatus);
      toast({
        title: "Billing Exemption Updated",
        description: `${organizationName} is now ${newStatus ? 'exempt from' : 'subject to'} billing`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating billing exemption:', error);
      toast({
        title: "Error Updating Billing Exemption",
        description: "There was an error updating the billing exemption status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Billing Exemption Status</CardTitle>
        <Shield className={`w-5 h-5 ${isExempt ? 'text-green-500' : 'text-gray-400'}`} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">
                Billing Exempt
              </h4>
              <p className="text-sm text-muted-foreground">
                {isExempt 
                  ? "This organization is exempt from all billing charges" 
                  : "This organization is subject to normal billing"}
              </p>
            </div>
            <Switch
              checked={isExempt}
              onCheckedChange={toggleExemption}
              disabled={isUpdating}
            />
          </div>
          
          {isExempt && (
            <div className="flex items-center space-x-2 rounded-md bg-yellow-50 p-3">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                This organization will not be charged for any services or subscriptions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
