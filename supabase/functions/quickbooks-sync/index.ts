import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { OAuthClient } from "https://esm.sh/intuit-oauth@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function createSyncLog(organization_id: string, entity_type: string, entity_id: string) {
  const { data: syncLog, error: logError } = await supabase
    .from('quickbooks_sync_logs')
    .insert({
      organization_id,
      entity_type,
      entity_id,
      sync_type: 'push',
      status: 'pending'
    })
    .select()
    .single();

  if (logError) throw logError;
  return syncLog;
}

async function getQuickBooksConnection(organization_id: string, maxRetries = 3) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    const { data: connData, error: connError } = await supabase
      .from('quickbooks_connections')
      .select('*')
      .eq('organization_id', organization_id)
      .single();

    if (!connError) return connData;

    if (retryCount === maxRetries - 1) throw connError;
    retryCount++;
    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
  }
}

async function refreshQuickBooksToken(oauthClient: any, connection: any, organization_id: string, maxRetries = 3) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    try {
      const refreshResponse = await oauthClient.refresh();
      await supabase
        .from('quickbooks_connections')
        .update({
          access_token: refreshResponse.token.access_token,
          refresh_token: refreshResponse.token.refresh_token,
          token_expires_at: new Date(Date.now() + refreshResponse.token.expires_in * 1000).toISOString(),
        })
        .eq('organization_id', organization_id);
      return;
    } catch (error) {
      console.error(`Token refresh attempt ${retryCount + 1} failed:`, error);
      if (retryCount === maxRetries - 1) throw error;
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
}

async function syncEntityWithRetry(entity_type: string, entity_id: string, oauthClient: any, realm_id: string, maxRetries = 3) {
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

async function updateSyncLogSuccess(syncLog: any, syncResult: any) {
  await supabase
    .from('quickbooks_sync_logs')
    .update({
      status: 'completed',
      quickbooks_id: syncResult.Id,
      processed_at: new Date().toISOString(),
      metadata: {
        sync_duration: Date.now() - new Date(syncLog.created_at).getTime()
      }
    })
    .eq('id', syncLog.id);
}

async function handleQuickBooksSync(req: Request) {
  const { organization_id, entity_type, entity_id } = await req.json();
  
  // Create sync log
  const syncLog = await createSyncLog(organization_id, entity_type, entity_id);

  // Get QuickBooks connection
  const connection = await getQuickBooksConnection(organization_id);
  if (!connection) {
    throw new Error('QuickBooks connection not found');
  }

  // Initialize OAuth client
  const oauthClient = new OAuthClient({
    clientId: Deno.env.get("QUICKBOOKS_CLIENT_ID")!,
    clientSecret: Deno.env.get("QUICKBOOKS_CLIENT_SECRET")!,
    environment: Deno.env.get("QUICKBOOKS_ENVIRONMENT") || "sandbox",
    redirectUri: `${Deno.env.get("PUBLIC_APP_URL")}/api/quickbooks/callback`,
  });

  // Set tokens
  oauthClient.setToken({
    access_token: connection.access_token,
    refresh_token: connection.refresh_token,
    expires_in: new Date(connection.token_expires_at).getTime() - Date.now(),
  });

  // Refresh token if needed
  if (new Date(connection.token_expires_at) < new Date()) {
    await refreshQuickBooksToken(oauthClient, connection, organization_id);
  }

  // Sync entity
  const syncResult = await syncEntityWithRetry(entity_type, entity_id, oauthClient, connection.realm_id);
  
  // Update sync log
  await updateSyncLogSuccess(syncLog, syncResult);

  return syncResult;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const syncResult = await handleQuickBooksSync(req);
    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('QuickBooks sync error:', error);

    if (error instanceof Error) {
      await supabase
        .from('quickbooks_sync_logs')
        .update({
          status: 'failed',
          error_message: error.message,
          metadata: {
            error_stack: error.stack,
            error_time: new Date().toISOString()
          }
        })
        .eq('id', syncLog?.id);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncInvoice(invoiceId: string, oauthClient: any, realmId: string) {
  // Get invoice data from Supabase
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .select('*, organizations(*)')
    .eq('id', invoiceId)
    .single();

  if (invError) throw invError;

  // Format invoice for QuickBooks
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

  // Create invoice in QuickBooks
  const response = await oauthClient.makeApiCall({
    url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
    method: 'POST',
    body: qbInvoice
  });

  return response.json();
}

async function syncPayment(paymentId: string, oauthClient: any, realmId: string) {
  // Get payment data from Supabase
  const { data: payment, error: payError } = await supabase
    .from('payments')
    .select('*, invoices(*)')
    .eq('id', paymentId)
    .single();

  if (payError) throw payError;

  // Format payment for QuickBooks
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

  // Create payment in QuickBooks
  const response = await oauthClient.makeApiCall({
    url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/payment`,
    method: 'POST',
    body: qbPayment
  });

  return response.json();
}

async function syncExpense(expenseId: string, oauthClient: any, realmId: string) {
  // Implementation for syncing expenses to QuickBooks
  // This would include getting the expense data from Supabase and creating/updating it in QuickBooks
  return { Id: 'QB_EXPENSE_ID' }; // Placeholder
}

function getQuickBooksPaymentMethod(method: string): string {
  const methodMap: { [key: string]: string } = {
    'cash': '1',
    'credit_card': '2',
    'check': '3',
    'insurance': '4',
    'motor_club': '5'
  };
  return methodMap[method] || '1';
}
