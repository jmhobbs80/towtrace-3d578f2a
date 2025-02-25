
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  impoundId: string
  type: string
  recipientEmail?: string
  recipientPhone?: string
  message: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { impoundId, type, recipientEmail, recipientPhone, message } = await req.json() as NotificationPayload

    // Get the notification details
    const { data: notification, error: notificationError } = await supabaseClient
      .from('impound_notifications')
      .select('*')
      .eq('impound_id', impoundId)
      .eq('type', type)
      .single()

    if (notificationError) throw notificationError

    // Get impound details
    const { data: impound, error: impoundError } = await supabaseClient
      .from('impounded_vehicles')
      .select(`
        *,
        inventory_vehicles (
          make,
          model,
          year,
          vin
        )
      `)
      .eq('id', impoundId)
      .single()

    if (impoundError) throw impoundError

    // TODO: Integrate with email service (e.g., Resend) to send actual emails
    console.log('Would send notification:', {
      to: recipientEmail,
      phone: recipientPhone,
      message,
      impound,
      notification
    })

    // Update notification status
    const { error: updateError } = await supabaseClient
      .from('impound_notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone
      })
      .eq('id', notification.id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
