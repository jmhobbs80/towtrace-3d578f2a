
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

    // Verify authentication and get user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) {
      throw new Error('Invalid authentication')
    }

    // Get user's organization and role
    const { data: orgMember } = await supabaseClient
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single()

    if (!orgMember) {
      throw new Error('User is not associated with an organization')
    }

    const { impoundId, type, recipientEmail, recipientPhone, message } = await req.json() as NotificationPayload

    // Verify impound record belongs to user's organization
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
      .eq('organization_id', orgMember.organization_id)
      .single()

    if (impoundError || !impound) {
      throw new Error('Unauthorized: Cannot send notifications for impounds from another organization')
    }

    // Rate limit check
    const rateLimitWindow = 5 * 60 * 1000; // 5 minutes
    const { count } = await supabaseClient
      .from('impound_notifications')
      .select('count')
      .eq('impound_id', impoundId)
      .gte('created_at', new Date(Date.now() - rateLimitWindow).toISOString())
      .single() || { count: 0 }

    if (count > 10) {
      throw new Error('Rate limit exceeded: Too many notifications sent recently')
    }

    const notificationPromises = []

    // Send email notification if recipient email is provided
    if (recipientEmail) {
      notificationPromises.push(
        resend.emails.send({
          from: 'notifications@yourdomain.com',
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
      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(recipientPhone)) {
        throw new Error('Invalid phone number format. Must be E.164 format (e.g., +1234567890)')
      }

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

    // Log notification
    const { error: notificationError } = await supabaseClient
      .from('impound_notifications')
      .insert({
        impound_id: impoundId,
        organization_id: orgMember.organization_id,
        type,
        status: 'sent',
        sent_by: user.id,
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone,
        metadata: {
          message,
          vehicle_info: impound.inventory_vehicles
        }
      })

    if (notificationError) throw notificationError

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
