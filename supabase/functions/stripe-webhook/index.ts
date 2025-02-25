
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
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const { error } = await supabase
          .from("organizations")
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_period_start: new Date(subscription.current_period_start * 1000),
            subscription_period_end: new Date(subscription.current_period_end * 1000),
            subscription_plan_id: subscription.items.data[0].price.lookup_key || subscription.items.data[0].price.id,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          })
          .eq("stripe_customer_id", subscription.customer);

        if (error) {
          console.error("Error updating organization subscription:", error);
          return new Response("Error updating subscription", { status: 500 });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const { error } = await supabase
          .from("organizations")
          .update({
            subscription_status: "inactive",
            subscription_period_end: new Date(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error updating organization subscription:", error);
          return new Response("Error updating subscription", { status: 500 });
        }
        break;
      }

      case "customer.created": {
        const customer = event.data.object;
        const { error } = await supabase
          .from("organizations")
          .update({
            stripe_customer_id: customer.id,
          })
          .eq("id", customer.metadata.organization_id);

        if (error) {
          console.error("Error updating organization customer:", error);
          return new Response("Error updating customer", { status: 500 });
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
