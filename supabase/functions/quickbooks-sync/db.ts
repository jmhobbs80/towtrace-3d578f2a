
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import type { SyncLog, QuickBooksConnection } from './types.ts';

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export async function createSyncLog(
  organization_id: string, 
  entity_type: string, 
  entity_id: string
): Promise<SyncLog> {
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

export async function getQuickBooksConnection(
  organization_id: string, 
  maxRetries = 3
): Promise<QuickBooksConnection> {
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

export async function updateSyncLogSuccess(syncLog: SyncLog, syncResult: any) {
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

export async function updateSyncLogError(syncLogId: string, error: Error) {
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
    .eq('id', syncLogId);
}
