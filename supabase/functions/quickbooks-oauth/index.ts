
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { OAuthClient } from "https://esm.sh/intuit-oauth@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const oauthClient = new OAuthClient({
  clientId: Deno.env.get("QUICKBOOKS_CLIENT_ID")!,
  clientSecret: Deno.env.get("QUICKBOOKS_CLIENT_SECRET")!,
  environment: Deno.env.get("QUICKBOOKS_ENVIRONMENT") || "sandbox",
  redirectUri: `${Deno.env.get("PUBLIC_APP_URL")}/api/quickbooks/callback`,
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (path === 'authorize') {
      const authUri = oauthClient.authorizeUri({
        scope: [
          'com.intuit.quickbooks.accounting',
          'com.intuit.quickbooks.payment'
        ],
        state: 'randomState',
      });

      return new Response(JSON.stringify({ url: authUri }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === 'callback') {
      const { code, realmId } = await req.json();
      
      const tokenResponse = await oauthClient.createToken(code);
      const { access_token, refresh_token, expires_in } = tokenResponse.token;

      const { organization_id } = await req.headers.get('organization-id');
      if (!organization_id) throw new Error('Organization ID is required');

      // Store tokens in Supabase
      const { error } = await supabase
        .from('quickbooks_connections')
        .upsert({
          organization_id,
          realm_id: realmId,
          access_token,
          refresh_token,
          token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid endpoint');
  } catch (error) {
    console.error('QuickBooks OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
