
import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentMethod, SubscriptionPlan } from "../types/billing";
import type { Json } from "@/integrations/supabase/types";

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

export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const { data: rawData, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  
  // Transform the raw data to match the SubscriptionPlan type
  const plans: SubscriptionPlan[] = (rawData || []).map(plan => {
    // Ensure features is an array of strings
    const features = Array.isArray(plan.features) 
      ? plan.features.map(f => String(f))
      : [];

    // Ensure limits is a Record<string, number>
    const limits: Record<string, number> = {};
    if (typeof plan.limits === 'object' && plan.limits !== null) {
      Object.entries(plan.limits).forEach(([key, value]) => {
        if (typeof value === 'number') {
          limits[key] = value;
        }
      });
    }

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description || undefined,
      price: plan.price,
      interval: plan.interval as 'month' | 'year',
      features,
      limits,
      is_active: Boolean(plan.is_active)
    };
  });

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
