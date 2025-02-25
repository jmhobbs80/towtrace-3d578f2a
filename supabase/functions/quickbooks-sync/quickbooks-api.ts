
import { supabase } from './db.ts';
import { QuickBooksConnection } from './types.ts';
import { OAuthClient } from "https://esm.sh/intuit-oauth@4.0.0";

export function initializeOAuthClient(): OAuthClient {
  return new OAuthClient({
    clientId: Deno.env.get("QUICKBOOKS_CLIENT_ID")!,
    clientSecret: Deno.env.get("QUICKBOOKS_CLIENT_SECRET")!,
    environment: Deno.env.get("QUICKBOOKS_ENVIRONMENT") || "sandbox",
    redirectUri: `${Deno.env.get("PUBLIC_APP_URL")}/api/quickbooks/callback`,
  });
}

export async function refreshQuickBooksToken(
  oauthClient: OAuthClient, 
  connection: QuickBooksConnection, 
  organization_id: string, 
  maxRetries = 3
) {
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

export function getQuickBooksPaymentMethod(method: string): string {
  const methodMap: { [key: string]: string } = {
    'cash': '1',
    'credit_card': '2',
    'check': '3',
    'insurance': '4',
    'motor_club': '5'
  };
  return methodMap[method] || '1';
}
