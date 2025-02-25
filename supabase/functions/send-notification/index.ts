
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

if (!vapidPublicKey || !vapidPrivateKey) {
  throw new Error('VAPID keys must be set')
}

webpush.setVapidDetails(
  'mailto:support@towtrace.com',
  vapidPublicKey,
  vapidPrivateKey
)

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  url?: string;
  jobId?: string;
  type?: string;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  tag?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: NotificationPayload = await req.json()

    // Get user's push subscription
    const { data: subscriptions, error: fetchError } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', payload.userId)

    if (fetchError || !subscriptions?.length) {
      console.error('Error fetching subscription:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Subscription not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send push notification
    const subscription = subscriptions[0].subscription
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url,
        jobId: payload.jobId,
        type: payload.type,
        actions: payload.actions,
        tag: payload.tag
      })
    )

    // Log successful notification
    await supabaseClient
      .from('notification_logs')
      .insert({
        user_id: payload.userId,
        type: payload.type || 'general',
        status: 'sent',
        payload: payload
      })

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
