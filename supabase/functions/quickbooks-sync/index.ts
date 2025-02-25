
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organization_id, entity_type, entity_id } = await req.json();
    
    // Log sync attempt
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

    // Get QuickBooks connection details
    const { data: connection, error: connError } = await supabase
      .from('quickbooks_connections')
      .select('*')
      .eq('organization_id', organization_id)
      .single();

    if (connError) throw connError;

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
      const refreshResponse = await oauthClient.refresh();
      await supabase
        .from('quickbooks_connections')
        .update({
          access_token: refreshResponse.token.access_token,
          refresh_token: refreshResponse.token.refresh_token,
          token_expires_at: new Date(Date.now() + refreshResponse.token.expires_in * 1000).toISOString(),
        })
        .eq('organization_id', organization_id);
    }

    // Sync data based on entity type
    let syncResult;
    switch (entity_type) {
      case 'invoice':
        syncResult = await syncInvoice(entity_id, oauthClient, connection.realm_id);
        break;
      case 'payment':
        syncResult = await syncPayment(entity_id, oauthClient, connection.realm_id);
        break;
      case 'expense':
        syncResult = await syncExpense(entity_id, oauthClient, connection.realm_id);
        break;
      default:
        throw new Error(`Unsupported entity type: ${entity_type}`);
    }

    // Update sync log
    await supabase
      .from('quickbooks_sync_logs')
      .update({
        status: 'completed',
        quickbooks_id: syncResult.Id,
        processed_at: new Date().toISOString()
      })
      .eq('id', syncLog.id);

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('QuickBooks sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncInvoice(invoiceId: string, oauthClient: any, realmId: string) {
  // Implementation for syncing invoices to QuickBooks
  // This would include getting the invoice data from Supabase and creating/updating it in QuickBooks
  return { Id: 'QB_INVOICE_ID' }; // Placeholder
}

async function syncPayment(paymentId: string, oauthClient: any, realmId: string) {
  // Implementation for syncing payments to QuickBooks
  return { Id: 'QB_PAYMENT_ID' }; // Placeholder
}

async function syncExpense(expenseId: string, oauthClient: any, realmId: string) {
  // Implementation for syncing expenses to QuickBooks
  return { Id: 'QB_EXPENSE_ID' }; // Placeholder
}
