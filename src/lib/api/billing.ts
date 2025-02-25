
import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentMethod, SubscriptionPlan, OrganizationType, RoleFeature, OrganizationRole, VolumeDiscount } from "../types/billing";

export const createPayment = async (data: {
  job_id: string;
  organization_id: string;
  amount: number;
  method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}): Promise<Payment> => {
  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select('*')
    .single();

  if (error) throw error;
  return payment;
};

export const fetchOrganizationRoles = async (organizationId: string): Promise<OrganizationRole[]> => {
  const { data, error } = await supabase
    .from('organization_roles')
    .select('*')
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data;
};

export const addOrganizationRole = async (
  organizationId: string, 
  roleType: OrganizationType, 
  isPrimary: boolean = false
): Promise<OrganizationRole> => {
  const { data, error } = await supabase
    .from('organization_roles')
    .insert({
      organization_id: organizationId,
      role_type: roleType,
      is_primary: isPrimary
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchRoleFeatures = async (organizationType: OrganizationType): Promise<RoleFeature[]> => {
  const { data, error } = await supabase
    .from('role_features')
    .select('*')
    .eq('organization_type', organizationType);

  if (error) throw error;
  return data;
};

export const fetchSubscriptionPlans = async (organizationType: OrganizationType): Promise<SubscriptionPlan[]> => {
  const { data: rawData, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .eq('organization_type', organizationType)
    .order('base_price', { ascending: true });

  if (error) throw error;
  
  const plans: SubscriptionPlan[] = rawData.map(plan => {
    // Safely parse volume_discount array
    let volumeDiscount: VolumeDiscount[] | undefined;
    if (Array.isArray(plan.volume_discount)) {
      volumeDiscount = plan.volume_discount.map(discount => {
        if (typeof discount === 'object' && discount !== null) {
          return {
            threshold: Number(discount.threshold) || 0,
            discount_percentage: Number(discount.discount_percentage) || 0
          };
        }
        return {
          threshold: 0,
          discount_percentage: 0
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
  
  // Add per-user and per-vehicle costs
  total += (plan.per_user_price * userCount);
  total += (plan.per_vehicle_price * vehicleCount);
  
  // Add costs for additional roles
  const validAdditionalRoles = additionalRoles.filter(role => 
    plan.addon_roles.includes(role)
  );
  total += (validAdditionalRoles.length * plan.addon_price);
  
  // Apply volume discounts if any
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
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { organizationId, planId, additionalRoles, successUrl, cancelUrl }
  });

  if (error) throw error;
  return data;
};

export const getJobPayments = async (jobId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updatePaymentStatus = async (paymentId: string, status: string): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', paymentId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};
