
import { supabase } from "@/integrations/supabase/client";
import type { Payment, Invoice } from "../../types/billing";
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

    // After creating invoice, sync with QuickBooks
    try {
      await supabase.functions.invoke('quickbooks-sync', {
        body: {
          organization_id: payment.organization_id,
          entity_type: 'invoice',
          entity_id: invoice.id
        }
      });
    } catch (syncError) {
      console.error('Error syncing invoice to QuickBooks:', syncError);
    }

    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};
