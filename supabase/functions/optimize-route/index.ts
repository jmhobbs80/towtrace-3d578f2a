
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pickup_location, delivery_location, preferences } = await req.json();

    // Simple distance-based pricing calculation
    const baseRate = 2.5; // $2.50 per mile
    const urgencyMultiplier = preferences?.urgency === 'high' ? 1.5 : 1;
    const distance = calculateDistance(
      pickup_location.coordinates,
      delivery_location.coordinates
    );

    const suggestedPrice = Math.round(distance * baseRate * urgencyMultiplier);
    const priceRange = {
      min: Math.round(suggestedPrice * 0.9),
      max: Math.round(suggestedPrice * 1.1),
    };

    return new Response(
      JSON.stringify({
        suggested_price: suggestedPrice,
        price_range: priceRange,
        distance,
        estimated_duration: Math.round(distance / 50 * 60), // Assuming 50mph average speed
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateDistance(
  point1: [number, number],
  point2: [number, number]
): number {
  const R = 3959; // Earth's radius in miles
  const lat1 = toRad(point1[0]);
  const lat2 = toRad(point2[0]);
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}
