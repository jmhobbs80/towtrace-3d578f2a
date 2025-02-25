
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type OrganizationType = Database['public']['Enums']['organization_type'];

interface BillingDetails {
  name?: string;
  email?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  subscription_tier: string;
  subscription_status: string;
  subscription_period_end?: string;
  stripe_customer_id?: string;
  subscription_plan_id?: string;
  member_count?: number;
  vehicle_count?: number;
  billing_details?: BillingDetails;
}

export const useOrganizationManager = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { toast } = useToast();

  const switchOrganization = useCallback(async (orgId: string) => {
    try {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        return;
      }

      if (org) {
        const formattedOrg: Organization = {
          id: org.id,
          name: org.name,
          type: org.type,
          subscription_tier: org.subscription_tier,
          subscription_status: org.subscription_status,
          subscription_period_end: org.subscription_period_end,
          stripe_customer_id: org.stripe_customer_id,
          subscription_plan_id: org.subscription_plan_id,
          member_count: org.member_count || 0,
          vehicle_count: org.vehicle_count || 0,
          billing_details: org.billing_details as BillingDetails
        };
        setOrganization(formattedOrg);
        
        await supabase.auth.updateUser({
          data: { current_organization_id: orgId }
        });
      }
    } catch (error) {
      console.error('Error switching organization:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to switch organization. Please try again.",
      });
    }
  }, [toast]);

  return {
    organization,
    switchOrganization
  };
};
