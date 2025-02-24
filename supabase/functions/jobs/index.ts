
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

interface JobInput {
  organization_id: string;
  pickup_location: { address: string; coordinates: [number, number] };
  delivery_location?: { address: string; coordinates: [number, number] };
  driver_id?: string;
  description?: string;
  priority?: number;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/')
    const jobId = path[path.length - 2] === 'jobs' ? null : path[path.length - 1]

    // Handle different HTTP methods
    switch (req.method) {
      case 'POST': {
        // Create new job
        const { organization_id, pickup_location, delivery_location, driver_id, description, priority } = await req.json() as JobInput
        
        const { data, error } = await supabaseClient
          .from('tow_jobs')
          .insert({
            organization_id,
            pickup_location,
            delivery_location,
            driver_id,
            description,
            priority: priority || 3,
            status: 'pending'
          })
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        })
      }

      case 'GET': {
        // Get all jobs or single job
        const { data: profile } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] || '')
        if (!profile.user) throw new Error('Not authenticated')

        // Get organization_id from organization_members table
        const { data: orgMember } = await supabaseClient
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', profile.user.id)
          .single()

        if (!orgMember?.organization_id) throw new Error('No organization found')

        const query = supabaseClient
          .from('tow_jobs')
          .select('*, driver:driver_id(*)')
          .eq('organization_id', orgMember.organization_id)

        if (jobId) {
          query.eq('id', jobId)
        }

        const { data, error } = await query
        if (error) throw error

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'PATCH': {
        if (!jobId) throw new Error('Job ID is required')

        if (path[path.length - 1] === 'assign') {
          // Assign driver endpoint
          const { driver_id } = await req.json()
          const { data, error } = await supabaseClient
            .from('tow_jobs')
            .update({ 
              driver_id,
              status: 'assigned',
              updated_at: new Date().toISOString()
            })
            .eq('id', jobId)
            .select()
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Update job status
          const { status } = await req.json()
          const { data, error } = await supabaseClient
            .from('tow_jobs')
            .update({ 
              status,
              completed_at: status === 'completed' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', jobId)
            .select()
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
