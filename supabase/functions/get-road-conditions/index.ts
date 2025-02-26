
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface Location {
  lat: number;
  lng: number;
}

interface RoadConditions {
  congestion_level: 'low' | 'medium' | 'high';
  incidents: any[];
  weather_conditions: {
    description: string;
    severity: 'good' | 'moderate' | 'poor';
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { locations, radius } = await req.json()

    if (!locations || !Array.isArray(locations)) {
      throw new Error('Locations array is required')
    }

    // TODO: In production, this would make calls to a traffic/weather API
    // For now, return simulated data based on time of day
    const hour = new Date().getHours()
    const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)

    const conditions: RoadConditions = {
      congestion_level: isPeakHour ? 'high' : 'low',
      incidents: [],
      weather_conditions: {
        description: "Clear",
        severity: "good"
      }
    }

    // Log for debugging
    console.log('Road conditions requested for locations:', locations)
    console.log('Returning conditions:', conditions)

    return new Response(JSON.stringify(conditions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in get-road-conditions:', error.message)
    return new Response(JSON.stringify({
      error: error.message,
      status: 'error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
