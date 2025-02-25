
import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentMethod, SubscriptionPlan } from "../types/billing";
import type { OrganizationType } from "../types/billing";

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

export const fetchSubscriptionPlans = async (organizationType: OrganizationType): Promise<SubscriptionPlan[]> => {
  const { data: rawData, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .eq('organization_type', organizationType)
    .order('base_price', { ascending: true });

  if (error) throw error;
  
  const plans: SubscriptionPlan[] = rawData.map(plan => ({
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
    volume_discount: plan.volume_discount as Array<{
      threshold: number;
      discount_percentage: number;
    }> || undefined,
    is_active: Boolean(plan.is_active)
  }));

  return plans;
};

export const createCheckoutSession = async ({
  organizationId,
  planId,
  successUrl,
  cancelUrl
}: {
  organizationId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { organizationId, planId, successUrl, cancelUrl }
  });

  if (error) throw error;
  return data;
};
