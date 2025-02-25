
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createSyncLog, getQuickBooksConnection, updateSyncLogSuccess, updateSyncLogError } from './db.ts';
import { initializeOAuthClient, refreshQuickBooksToken } from './quickbooks-api.ts';
import { syncEntityWithRetry } from './sync-entities.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function handleQuickBooksSync(req: Request) {
  const { organization_id, entity_type, entity_id } = await req.json();
  
  const syncLog = await createSyncLog(organization_id, entity_type, entity_id);
  const connection = await getQuickBooksConnection(organization_id);
  
  if (!connection) {
    throw new Error('QuickBooks connection not found');
  }

  const oauthClient = initializeOAuthClient();
  oauthClient.setToken({
    access_token: connection.access_token,
    refresh_token: connection.refresh_token,
    expires_in: new Date(connection.token_expires_at).getTime() - Date.now(),
  });

  if (new Date(connection.token_expires_at) < new Date()) {
    await refreshQuickBooksToken(oauthClient, connection, organization_id);
  }

  const syncResult = await syncEntityWithRetry(entity_type, entity_id, oauthClient, connection.realm_id);
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
      await updateSyncLogError(syncLog?.id, error);
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
