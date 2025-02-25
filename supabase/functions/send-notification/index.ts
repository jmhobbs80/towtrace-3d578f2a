
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

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
  type: 'job' | 'billing' | 'role' | 'system' | 'maintenance';
  url?: string;
  jobId?: string;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  tag?: string;
  data?: Record<string, any>;
}

async function sendPushNotification(subscription: any, payload: NotificationPayload) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url,
        jobId: payload.jobId,
        type: payload.type,
        actions: payload.actions,
        tag: payload.tag,
        data: payload.data
      })
    );
    return true;
  } catch (error) {
    console.error('Push notification failed:', error);
    return false;
  }
}

async function sendEmailNotification(email: string, payload: NotificationPayload) {
  try {
    await resend.emails.send({
      from: 'notifications@towtrace.com',
      to: [email],
      subject: payload.title,
      html: `
        <h1>${payload.title}</h1>
        <p>${payload.body}</p>
        ${payload.url ? `<p>View details: <a href="${payload.url}">${payload.url}</a></p>` : ''}
      `
    });
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
}

async function sendSMSNotification(phoneNumber: string, payload: NotificationPayload) {
  try {
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Twilio configuration missing');
    }

    const message = `${payload.title}\n${payload.body}${payload.url ? `\n${payload.url}` : ''}`;
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: twilioPhoneNumber,
          Body: message
        })
      }
    );

    if (!response.ok) {
      throw new Error('SMS send failed');
    }

    return true;
  } catch (error) {
    console.error('SMS notification failed:', error);
    return false;
  }
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

    // Get user's notification preferences
    const { data: preferences, error: prefError } = await supabaseClient
      .from('notification_preferences')
      .select('*')
      .eq('user_id', payload.userId)
      .single();

    if (prefError) {
      throw prefError;
    }

    const results = {
      push: false,
      email: false,
      sms: false
    };

    // Send push notification if enabled
    if (preferences.push_enabled) {
      const { data: subscriptions } = await supabaseClient
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', payload.userId);

      if (subscriptions?.[0]) {
        results.push = await sendPushNotification(subscriptions[0].subscription, payload);
      }
    }

    // Send email if enabled
    if (preferences.email_enabled) {
      const { data: userData } = await supabaseClient.auth.admin.getUserById(payload.userId);
      if (userData?.user?.email) {
        results.email = await sendEmailNotification(userData.user.email, payload);
      }
    }

    // Send SMS if enabled
    if (preferences.sms_enabled && preferences.phone_number) {
      results.sms = await sendSMSNotification(preferences.phone_number, payload);
    }

    // Log notification
    await supabaseClient
      .from('notification_logs')
      .insert({
        user_id: payload.userId,
        type: payload.type,
        status: Object.values(results).some(r => r) ? 'sent' : 'failed',
        payload: payload,
        delivery_results: results
      });

    return new Response(
      JSON.stringify({ message: 'Notifications processed', results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
