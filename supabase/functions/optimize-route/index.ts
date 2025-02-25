
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
    const { jobId, manualOverride } = await req.json();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch job details
    const { data: job } = await supabaseClient
      .from('tow_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (!job) {
      throw new Error('Job not found');
    }

    // Get available drivers
    const { data: availableDrivers } = await supabaseClient
      .from('profiles')
      .select(`
        *,
        current_location:driver_locations(coordinates)
      `)
      .eq('role', 'driver')
      .eq('status', 'available')
      .order('last_job_completed', { ascending: true });

    if (!availableDrivers?.length) {
      throw new Error('No available drivers found');
    }

    // Calculate optimal driver based on:
    // 1. Distance to pickup location
    // 2. Driver's current workload
    // 3. Last job completion time (for fair distribution)
    const optimalDriver = availableDrivers.reduce((best, current) => {
      const currentLocation = current.current_location?.[0]?.coordinates;
      if (!currentLocation) return best;

      const distance = calculateDistance(
        [currentLocation.lat, currentLocation.lng],
        [job.pickup_location.coordinates[0], job.pickup_location.coordinates[1]]
      );

      const score = distance * 0.6 + // 60% weight on distance
        (Date.now() - new Date(current.last_job_completed).getTime()) * 0.4; // 40% weight on time since last job

      return (!best || score < best.score) ? { driver: current, score } : best;
    }, null)?.driver;

    if (!optimalDriver) {
      throw new Error('Could not determine optimal driver');
    }

    // Calculate optimal route
    const route = await calculateOptimalRoute(
      job.pickup_location.coordinates,
      job.delivery_location.coordinates
    );

    const result = {
      suggested_driver_id: optimalDriver.id,
      optimized_route: route.waypoints,
      estimated_duration: route.duration,
      estimated_distance: route.distance,
    };

    // If not in manual override mode, automatically assign the driver
    if (!manualOverride) {
      const { error: updateError } = await supabaseClient
        .from('tow_jobs')
        .update({
          driver_id: optimalDriver.id,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      // Store route optimization
      await supabaseClient
        .from('route_optimizations')
        .insert({
          job_id: jobId,
          driver_id: optimalDriver.id,
          start_location: { 
            lat: job.pickup_location.coordinates[0],
            lng: job.pickup_location.coordinates[1]
          },
          end_location: {
            lat: job.delivery_location.coordinates[0],
            lng: job.delivery_location.coordinates[1]
          },
          waypoints: route.waypoints,
          estimated_duration: route.duration,
          estimated_distance: route.distance,
          optimization_score: route.score
        });
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = toRad(point1[0]);
  const lat2 = toRad(point2[0]);
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

async function calculateOptimalRoute(
  start: [number, number],
  end: [number, number]
): Promise<{
  waypoints: any[];
  duration: number;
  distance: number;
  score: number;
}> {
  // For now, return a simple direct route
  // In production, this would integrate with a routing service like Mapbox
  return {
    waypoints: [
      { lat: start[0], lng: start[1] },
      { lat: end[0], lng: end[1] }
    ],
    duration: calculateDistance(start, end) / 50 * 3600, // Assuming 50 km/h average speed
    distance: calculateDistance(start, end),
    score: 0.85
  };
}
