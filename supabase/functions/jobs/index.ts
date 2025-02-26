
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

    // Verify authentication and get user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) {
      throw new Error('Invalid authentication')
    }

    // Get user's role and organization
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const { data: orgMember } = await supabaseClient
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single()

    if (!orgMember?.organization_id) {
      throw new Error('User is not associated with an organization')
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'POST': {
        // Create new job
        const { organization_id, pickup_location, delivery_location, driver_id, description, priority } = await req.json() as JobInput
        
        // Verify organization membership
        if (organization_id !== orgMember.organization_id) {
          throw new Error('Unauthorized: Cannot create job for another organization')
        }

        // Check if user has permission to assign drivers (if driver_id is provided)
        if (driver_id && orgMember.role !== 'admin' && userRole?.role !== 'dispatcher') {
          throw new Error('Unauthorized: Insufficient privileges to assign drivers')
        }

        const { data, error } = await supabaseClient
          .from('tow_jobs')
          .insert({
            organization_id,
            pickup_location,
            delivery_location,
            driver_id,
            description,
            priority: priority || 3,
            status: 'pending',
            created_by: user.id
          })
          .select()
          .single()

        if (error) throw error

        // Log the job creation
        await supabaseClient.rpc('log_admin_action', {
          action_type: 'job_created',
          entity_type: 'tow_jobs',
          entity_id: data.id,
          metadata: { driver_id, priority }
        })

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        })
      }

      case 'GET': {
        // Get all jobs or single job
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

        // Verify job belongs to user's organization
        const { data: job, error: jobError } = await supabaseClient
          .from('tow_jobs')
          .select('organization_id, driver_id, status')
          .eq('id', jobId)
          .single()

        if (jobError) throw jobError
        if (job.organization_id !== orgMember.organization_id) {
          throw new Error('Unauthorized: Cannot modify job from another organization')
        }

        if (path[path.length - 1] === 'assign') {
          // Check assignment permissions
          if (orgMember.role !== 'admin' && userRole?.role !== 'dispatcher') {
            throw new Error('Unauthorized: Insufficient privileges to assign drivers')
          }

          const { driver_id } = await req.json()
          const { data, error } = await supabaseClient
            .from('tow_jobs')
            .update({ 
              driver_id,
              status: 'assigned',
              updated_at: new Date().toISOString(),
              updated_by: user.id
            })
            .eq('id', jobId)
            .select()
            .single()

          if (error) throw error

          // Log the assignment
          await supabaseClient.rpc('log_admin_action', {
            action_type: 'job_assigned',
            entity_type: 'tow_jobs',
            entity_id: jobId,
            metadata: { driver_id }
          })

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Update job status
          const { status } = await req.json()

          // Check status update permissions
          if (job.driver_id !== user.id && orgMember.role !== 'admin' && userRole?.role !== 'dispatcher') {
            throw new Error('Unauthorized: Only assigned driver, admin, or dispatcher can update job status')
          }

          // Validate status transitions
          const validTransitions: Record<string, string[]> = {
            'pending': ['assigned', 'cancelled'],
            'assigned': ['en_route', 'cancelled'],
            'en_route': ['on_site', 'cancelled'],
            'on_site': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
          }

          if (!validTransitions[job.status].includes(status)) {
            throw new Error(`Invalid status transition from ${job.status} to ${status}`)
          }

          const { data, error } = await supabaseClient
            .from('tow_jobs')
            .update({ 
              status,
              completed_at: status === 'completed' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
              updated_by: user.id
            })
            .eq('id', jobId)
            .select()
            .single()

          if (error) throw error

          // Log the status change
          await supabaseClient.rpc('log_admin_action', {
            action_type: 'job_status_updated',
            entity_type: 'tow_jobs',
            entity_id: jobId,
            metadata: { old_status: job.status, new_status: status }
          })

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
    console.error('Error in jobs function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
