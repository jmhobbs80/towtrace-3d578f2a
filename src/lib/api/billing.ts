
import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentMethod, SubscriptionPlan } from "../types/billing";

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
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  return data;
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
