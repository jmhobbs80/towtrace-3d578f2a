
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.12.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

const handler = async (req: Request): Promise<Response> => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Webhook Error: No Stripe signature", { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log(`✅ Received Stripe webhook event: ${event.type}`);

    switch (event.type) {
      // Payment Events
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const jobId = paymentIntent.metadata.job_id;
        const organizationId = paymentIntent.metadata.organization_id;
        
        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            job_id: jobId,
            organization_id: organizationId,
            amount: paymentIntent.amount / 100, // Convert from cents
            method: 'credit_card',
            status: 'processed',
            reference_number: paymentIntent.id,
            processed_at: new Date().toISOString(),
            metadata: {
              stripe_payment_intent_id: paymentIntent.id,
              payment_method_type: paymentIntent.payment_method_type,
            }
          });

        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
          return new Response('Error creating payment record', { status: 500 });
        }

        // Calculate and process earnings
        await supabase.rpc('process_job_earnings', {
          job_id: jobId,
          total_amount: paymentIntent.amount / 100,
          is_surge: false
        });

        // Update job status
        await supabase
          .from('tow_jobs')
          .update({ 
            payment_status: 'paid',
            status: 'completed'
          })
          .eq('id', jobId);

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const jobId = paymentIntent.metadata.job_id;

        // Update job status
        await supabase
          .from('tow_jobs')
          .update({ 
            payment_status: 'failed',
            payment_error: paymentIntent.last_payment_error?.message
          })
          .eq('id', jobId);

        break;
      }

      // Subscription Events
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === 'subscription') {
          const organizationId = session.metadata.organization_id;
          const subscriptionId = session.subscription;
          
          // Fetch subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          
          // Update organization subscription details
          await supabase
            .from('organizations')
            .update({
              subscription_status: 'active',
              stripe_subscription_id: subscriptionId,
              subscription_plan_id: session.metadata.plan_id,
              subscription_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', organizationId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const organizationId = subscription.metadata.organization_id;

        await supabase
          .from('organizations')
          .update({
            subscription_status: subscription.status,
            subscription_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('id', organizationId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const organizationId = subscription.metadata.organization_id;

        await supabase
          .from('organizations')
          .update({
            subscription_status: 'canceled',
            subscription_period_end: new Date(subscription.canceled_at * 1000).toISOString()
          })
          .eq('id', organizationId);

        break;
      }

      // Invoice Events
      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const organizationId = subscription.metadata.organization_id;

          await supabase
            .from('organizations')
            .update({
              subscription_status: 'active',
              subscription_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', organizationId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const organizationId = subscription.metadata.organization_id;

          await supabase
            .from('organizations')
            .update({
              subscription_status: 'past_due'
            })
            .eq('id', organizationId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
