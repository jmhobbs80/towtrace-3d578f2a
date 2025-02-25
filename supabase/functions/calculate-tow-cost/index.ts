
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { pickup_location, delivery_location, service_type } = await req.json()

    // Basic cost calculation (you can make this more sophisticated)
    const baseCosts = {
      light_duty: 75,
      heavy_duty: 150,
      roadside_assistance: 50,
    }

    const basePrice = baseCosts[service_type as keyof typeof baseCosts]
    
    // For now, return a simple estimate
    // In a real app, you'd want to use a mapping service to calculate actual distance
    const estimatedCost = basePrice + 2.50 // Add per-mile rate

    return new Response(
      JSON.stringify({ cost: estimatedCost }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
