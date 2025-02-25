
import { supabase } from './db.ts';
import type { SyncResult } from './types.ts';
import { getQuickBooksPaymentMethod } from './quickbooks-api.ts';

export async function syncEntityWithRetry(
  entity_type: string, 
  entity_id: string, 
  oauthClient: any, 
  realm_id: string, 
  maxRetries = 3
): Promise<SyncResult> {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    try {
      switch (entity_type) {
        case 'invoice':
          return await syncInvoice(entity_id, oauthClient, realm_id);
        case 'payment':
          return await syncPayment(entity_id, oauthClient, realm_id);
        case 'expense':
          return await syncExpense(entity_id, oauthClient, realm_id);
        default:
          throw new Error(`Unsupported entity type: ${entity_type}`);
      }
    } catch (error) {
      console.error(`Sync attempt ${retryCount + 1} failed:`, error);
      if (retryCount === maxRetries - 1) throw error;
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
}

async function syncInvoice(invoiceId: string, oauthClient: any, realmId: string): Promise<SyncResult> {
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .select('*, organizations(*)')
    .eq('id', invoiceId)
    .single();

  if (invError) throw invError;

  const qbInvoice = {
    Line: invoice.items.map((item: any) => ({
      Amount: item.amount,
      Description: item.description,
      DetailType: "SalesItemLineDetail",
      SalesItemLineDetail: {
        Qty: item.quantity,
        UnitPrice: item.amount / item.quantity
      }
    })),
    CustomerRef: {
      value: invoice.customer_id
    }
  };

  const response = await oauthClient.makeApiCall({
    url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
    method: 'POST',
    body: qbInvoice
  });

  return response.json();
}

async function syncPayment(paymentId: string, oauthClient: any, realmId: string): Promise<SyncResult> {
  const { data: payment, error: payError } = await supabase
    .from('payments')
    .select('*, invoices(*)')
    .eq('id', paymentId)
    .single();

  if (payError) throw payError;

  const qbPayment = {
    TotalAmt: payment.amount,
    CustomerRef: {
      value: payment.customer_id
    },
    PaymentMethodRef: {
      value: getQuickBooksPaymentMethod(payment.method)
    },
    LinkedTxn: [{
      TxnId: payment.invoices?.quickbooks_id,
      TxnType: "Invoice"
    }]
  };

  const response = await oauthClient.makeApiCall({
    url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/payment`,
    method: 'POST',
    body: qbPayment
  });

  return response.json();
}

async function syncExpense(expenseId: string, oauthClient: any, realmId: string): Promise<SyncResult> {
  // Implementation for syncing expenses to QuickBooks
  return { Id: 'QB_EXPENSE_ID' }; // Placeholder
}
