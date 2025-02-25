
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentNotification {
  organization_id: string;
  payment_id: string;
  amount: number;
  error: string;
  customer_email?: string;
  customer_phone?: string;
}

async function sendEmailNotification(notification: PaymentNotification) {
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', notification.organization_id)
    .single();

  await resend.emails.send({
    from: "Lovable <notifications@resend.dev>",
    to: [notification.customer_email!],
    subject: "Payment Failed",
    html: `
      <h1>Payment Failed</h1>
      <p>Dear customer,</p>
      <p>We were unable to process your payment of $${notification.amount} for ${org?.name}.</p>
      <p>Error: ${notification.error}</p>
      <p>Please update your payment information to avoid service interruption.</p>
    `,
  });
}

async function logNotification(notification: PaymentNotification, type: string) {
  await supabase
    .from('payment_notifications')
    .insert({
      organization_id: notification.organization_id,
      payment_id: notification.payment_id,
      notification_type: type,
      status: 'sent',
      metadata: {
        amount: notification.amount,
        error: notification.error,
        sent_to: type === 'email' ? notification.customer_email : notification.customer_phone
      }
    });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: PaymentNotification = await req.json();
    const tasks: Promise<any>[] = [];

    // Send email notification if email is provided
    if (notification.customer_email) {
      tasks.push(
        sendEmailNotification(notification)
          .then(() => logNotification(notification, 'email'))
      );
    }

    // Add SMS notification here if implementing Twilio integration
    // if (notification.customer_phone) {
    //   tasks.push(sendSmsNotification(notification));
    // }

    await Promise.all(tasks);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing payment notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
};

serve(handler);
