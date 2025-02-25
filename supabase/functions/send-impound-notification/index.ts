
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'
import { Twilio } from 'npm:twilio@4.19.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const twilioClient = new Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
);

interface NotificationPayload {
  impoundId: string
  type: string
  recipientEmail?: string
  recipientPhone?: string
  message: string
}

const getEmailTemplate = (data: {
  type: string
  message: string
  vehicle?: {
    make: string
    model: string
    year: number
    vin: string
  }
}) => {
  const vehicleInfo = data.vehicle 
    ? `Vehicle Information:
       ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}
       VIN: ${data.vehicle.vin}`
    : '';

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a1a1a;">Impound Notification</h1>
      <p style="color: #4a4a4a; font-size: 16px;">${data.message}</p>
      ${vehicleInfo ? `
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #4a4a4a;">${vehicleInfo}</p>
        </div>
      ` : ''}
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;
};

const getSMSTemplate = (data: {
  type: string
  message: string
  vehicle?: {
    make: string
    model: string
    year: number
  }
}) => {
  const vehicleInfo = data.vehicle 
    ? `Vehicle: ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}`
    : '';

  return `${data.message}\n${vehicleInfo}`;
};

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

    const notificationPromises = []

    // Send email notification if recipient email is provided
    if (recipientEmail) {
      notificationPromises.push(
        resend.emails.send({
          from: 'notifications@yourdomain.com', // Replace with your verified domain
          to: recipientEmail,
          subject: `Impound Notification: ${type.replace(/_/g, ' ').toUpperCase()}`,
          html: getEmailTemplate({
            type,
            message,
            vehicle: impound.inventory_vehicles
          })
        }).catch(error => {
          console.error('Failed to send email:', error);
          return null;
        })
      );
    }

    // Send SMS notification if recipient phone is provided
    if (recipientPhone) {
      notificationPromises.push(
        twilioClient.messages.create({
          body: getSMSTemplate({
            type,
            message,
            vehicle: impound.inventory_vehicles
          }),
          to: recipientPhone,
          from: Deno.env.get('TWILIO_PHONE_NUMBER')
        }).catch(error => {
          console.error('Failed to send SMS:', error);
          return null;
        })
      );
    }

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);

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
    console.error('Error in send-impound-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
