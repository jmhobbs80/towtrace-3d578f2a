
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateInviteRequest {
  email?: string;
  phone?: string;
  organization_id: string;
  metadata?: Record<string, unknown>;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify JWT
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)
    if (userError || !user) throw new Error('Invalid token')

    const { method } = req
    const url = new URL(req.url)

    if (method === 'POST') {
      const { email, phone, organization_id, metadata } = await req.json() as GenerateInviteRequest
      
      // Generate a secure token
      const token = crypto.randomUUID()

      const { data, error } = await supabase
        .from('driver_invites')
        .insert({
          token,
          email,
          phone,
          organization_id,
          created_by: user.id,
          metadata
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({
          invite: data,
          inviteUrl: `${url.origin}/auth?invite=${token}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (method === 'GET') {
      const token = url.searchParams.get('token')
      if (!token) throw new Error('No token provided')

      const { data, error } = await supabase
        .rpc('validate_driver_invite', { token_input: token })
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    throw new Error(`Method ${method} not allowed`)

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
