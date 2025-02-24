
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const MAPBOX_PUBLIC_TOKEN = "pk.eyJ1IjoiYXVkaW9pbnN0YWxyIiwiYSI6ImNtN2Zpcmg5MDAybHUybHB5Mm9odWhyMGkifQ.6LAoIZGRvi7Sgfty-C4qsA"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Return the Mapbox token
    return new Response(
      JSON.stringify({
        token: MAPBOX_PUBLIC_TOKEN,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
