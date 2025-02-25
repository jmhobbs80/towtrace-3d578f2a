
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.12.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { organizationId, planId, additionalRoles = [], successUrl, cancelUrl } = await req.json();

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("*, organization_members(count)")
      .eq("id", organizationId)
      .single();

    if (orgError || !org) {
      throw new Error("Organization not found");
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    let customerId = org.stripe_customer_id;

    // Create or get Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          organization_id: organizationId,
        },
      });
      customerId = customer.id;

      // Update organization with Stripe customer ID
      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", organizationId);
    }

    // Calculate total price including additional roles
    const basePrice = plan.base_price;
    const addonPrice = plan.addon_price * additionalRoles.length;
    const totalPrice = basePrice + addonPrice;

    // Check for valid promo code with trial period
    const { data: promoData } = await supabase
      .from('promo_code_redemptions')
      .select('promo_codes(*)')
      .eq('organization_id', organizationId)
      .single();

    // Create Stripe Checkout session with trial period if applicable
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `${plan.description}${additionalRoles.length ? ` + ${additionalRoles.length} additional roles` : ''}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
            recurring: {
              interval: plan.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          organization_id: organizationId,
          plan_id: planId,
          additional_roles: JSON.stringify(additionalRoles),
        },
        // Add trial period if promo code exists and is valid
        trial_period_days: promoData?.promo_codes?.trial_days || undefined,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
