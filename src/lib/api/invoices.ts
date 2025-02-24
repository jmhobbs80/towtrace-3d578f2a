
import { supabase } from "@/integrations/supabase/client";
import type { Payment } from "@/lib/types/billing";
import type { Job } from "@/lib/types/job";

export const createInvoiceFromPayment = async (payment: Payment, job: Job) => {
  const invoiceNumber = `INV-${Date.now()}-${job.id.slice(0, 4)}`;
  
  const invoiceItems = [{
    description: `Towing Service - ${job.service_type}`,
    amount: payment.amount,
    quantity: 1
  }];

  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        organization_id: payment.organization_id,
        customer_id: job.customer_id,
        total_amount: payment.amount,
        items: invoiceItems,
        status: payment.status === 'processed' ? 'paid' : 'pending',
        paid_date: payment.status === 'processed' ? payment.processed_at : null
      })
      .select()
      .single();

    if (error) throw error;
    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const getInvoices = async (organizationId: string) => {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const getInvoicePdf = async (invoiceId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
      method: 'POST',
      body: { invoiceId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
};
