
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Organization {
  id: string;
  name: string;
  trial_end: string;
  subscription_status: string;
}

interface Profile {
  id: string;
  email: string;
  first_name: string;
}

const sendTrialEndingEmail = async (profile: Profile, org: Organization, daysLeft: number) => {
  try {
    await resend.emails.send({
      from: "TowTrace <notifications@towtrace.app>",
      to: [profile.email],
      subject: `Your TowTrace trial ends in ${daysLeft} days`,
      html: `
        <h1>Hi ${profile.first_name},</h1>
        <p>Your free trial for ${org.name} will end in ${daysLeft} days.</p>
        <p>To continue using TowTrace without interruption, please upgrade to a paid plan.</p>
        <p><a href="https://app.towtrace.com/billing">Upgrade Now</a></p>
        <p>Need more time? Contact our support team to request a trial extension.</p>
        <p>Best regards,<br>The TowTrace Team</p>
      `,
    });

    console.log(`Trial ending email sent to ${profile.email}`);
  } catch (error) {
    console.error(`Failed to send trial ending email to ${profile.email}:`, error);
  }
};

const handler = async (_req: Request): Promise<Response> => {
  try {
    // Get organizations with active trials ending in 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, trial_end')
      .eq('subscription_status', 'trial')
      .lt('trial_end', sevenDaysFromNow.toISOString())
      .gt('trial_end', new Date().toISOString());

    if (orgsError) throw orgsError;

    for (const org of (orgs || [])) {
      // Get organization members
      const { data: members } = await supabase
        .from('organization_members')
        .select('user_id')
        .eq('organization_id', org.id)
        .eq('role', 'owner');

      if (!members?.length) continue;

      // Get member profiles and send notifications
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name')
        .in('id', members.map(m => m.user_id));

      if (!profiles?.length) continue;

      const daysLeft = Math.ceil(
        (new Date(org.trial_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send email to each organization owner
      for (const profile of profiles) {
        await sendTrialEndingEmail(profile, org, daysLeft);
      }

      // Create in-app notification
      await supabase.from('notifications').insert(
        profiles.map(profile => ({
          user_id: profile.id,
          type: 'trial_ending',
          title: 'Trial Ending Soon',
          message: `Your trial will end in ${daysLeft} days. Upgrade now to continue using TowTrace.`,
          metadata: {
            days_left: daysLeft,
            organization_id: org.id,
          }
        }))
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing trial expiration alerts:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
