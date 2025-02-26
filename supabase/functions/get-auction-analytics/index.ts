
import { serve } from 'https://deno.fresh.dev/server'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request data
    const { auctionId } = await req.json()
    
    if (!auctionId) {
      throw new Error('Auction ID is required')
    }

    // Get auction results with vehicle details
    const { data: results, error } = await supabase
      .from('auction_results')
      .select(`
        *,
        vehicle:vehicle_id (
          year,
          make,
          model,
          condition
        )
      `)
      .eq('auction_id', auctionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching auction analytics:', error)
      throw error
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
