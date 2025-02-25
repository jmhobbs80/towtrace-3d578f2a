import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionPlan, OrganizationType, OrganizationRow, VolumeDiscount } from "../../types/billing";

export const fetchSubscriptionPlans = async (organizationType: OrganizationType): Promise<SubscriptionPlan[]> => {
  const { data: rawData, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .eq('organization_type', organizationType)
    .order('base_price', { ascending: true });

  if (error) throw error;
  
  const plans: SubscriptionPlan[] = rawData.map(plan => {
    let volumeDiscount: VolumeDiscount[] | undefined;
    if (Array.isArray(plan.volume_discount)) {
      volumeDiscount = plan.volume_discount.map(discount => {
        const discountObj = discount as Record<string, unknown>;
        return {
          threshold: typeof discountObj.threshold === 'number' ? discountObj.threshold : 
                    typeof discountObj.threshold === 'string' ? Number(discountObj.threshold) : 0,
          discount_percentage: typeof discountObj.discount_percentage === 'number' ? discountObj.discount_percentage :
                             typeof discountObj.discount_percentage === 'string' ? Number(discountObj.discount_percentage) : 0
        };
      });
    }

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description || undefined,
      organization_type: plan.organization_type,
      base_price: plan.base_price,
      per_user_price: plan.per_user_price || 0,
      per_vehicle_price: plan.per_vehicle_price || 0,
      interval: plan.interval as 'month' | 'year',
      tier: plan.tier || 'standard',
      features: Array.isArray(plan.features) ? plan.features.map(String) : [],
      limits: plan.limits as Record<string, number>,
      addon_roles: plan.addon_roles || [],
      addon_price: plan.addon_price || 0,
      volume_discount: volumeDiscount,
      is_active: Boolean(plan.is_active)
    };
  });

  return plans;
};

export const calculateSubscriptionCost = async (
  plan: SubscriptionPlan,
  userCount: number,
  vehicleCount: number,
  additionalRoles: OrganizationType[] = []
): Promise<number> => {
  let total = plan.base_price;
  
  total += (plan.per_user_price * userCount);
  total += (plan.per_vehicle_price * vehicleCount);
  
  const validAdditionalRoles = additionalRoles.filter(role => 
    plan.addon_roles.includes(role)
  );
  total += (validAdditionalRoles.length * plan.addon_price);
  
  if (plan.volume_discount) {
    for (const discount of plan.volume_discount) {
      if (userCount >= discount.threshold) {
        total = total * (1 - (discount.discount_percentage / 100));
        break;
      }
    }
  }
  
  return Number(total.toFixed(2));
};

export const createCheckoutSession = async ({
  organizationId,
  planId,
  additionalRoles = [],
  successUrl,
  cancelUrl
}: {
  organizationId: string;
  planId: string;
  additionalRoles?: OrganizationType[];
  successUrl: string;
  cancelUrl: string;
}) => {
  // Check if organization is billing exempt
  const { data: org } = await supabase
    .from('organizations')
    .select('billing_exempt')
    .eq('id', organizationId)
    .single() as { data: Pick<OrganizationRow, 'billing_exempt'> | null };

  // If organization is billing exempt, update their subscription directly
  if (org?.billing_exempt) {
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        subscription_plan_id: planId,
        subscription_status: 'active',
        subscription_tier: 'enterprise',
        trial_end: null
      } as Partial<OrganizationRow>)
      .eq('id', organizationId);

    if (updateError) throw updateError;
    return { url: successUrl };
  }

  // Normal checkout process for non-exempt organizations
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { organizationId, planId, additionalRoles, successUrl, cancelUrl }
  });

  if (error) throw error;
  return data;
};
