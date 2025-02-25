
import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentMethod } from "../../types/billing";
import type { Job } from "@/lib/types/job";

export const createPayment = async (data: {
  job_id: string;
  organization_id: string;
  amount: number;
  method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}): Promise<Payment> => {
  // Check if organization is billing exempt
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('billing_exempt')
    .eq('id', data.organization_id)
    .single();

  if (orgError) throw orgError;

  // If organization is billing exempt, create a $0 processed payment
  if (org.billing_exempt) {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        ...data,
        amount: 0,
        status: 'processed',
        processed_at: new Date().toISOString(),
        notes: `${data.notes || ''} (Billing Exempt Organization)`.trim()
      })
      .select('*')
      .single();

    if (error) throw error;
    return payment;
  }

  // Normal payment processing for non-exempt organizations
  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select('*')
    .single();

  if (error) throw error;

  // After creating payment, sync with QuickBooks
  try {
    await supabase.functions.invoke('quickbooks-sync', {
      body: {
        organization_id: data.organization_id,
        entity_type: 'payment',
        entity_id: payment.id
      }
    });
  } catch (syncError) {
    console.error('Error syncing payment to QuickBooks:', syncError);
  }

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
