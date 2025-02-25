
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

interface OptimizeRouteInput {
  pickupLocation: {
    address: string;
    coordinates?: [number, number];
  };
  deliveryLocation: {
    address: string;
    coordinates?: [number, number];
  };
  constraints?: {
    maxDrivingHours?: number;
    requiredStops?: number;
    avoidHighways?: boolean;
  };
}

interface RouteStop {
  location: {
    address: string;
    coordinates: [number, number];
  };
  estimatedArrival: string;
  distanceFromPrevious: number;
  durationFromPrevious: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pickupLocation, deliveryLocation, constraints } = await req.json() as OptimizeRouteInput

    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_TOKEN')
    if (!MAPBOX_TOKEN) {
      throw new Error('Missing Mapbox token')
    }

    // Get coordinates for pickup and delivery if not provided
    const locations = [pickupLocation, deliveryLocation]
    const routeStops: RouteStop[] = []

    // Get coordinates for each location using Mapbox Geocoding API
    for (const location of locations) {
      if (!location.coordinates) {
        const encodedAddress = encodeURIComponent(location.address)
        const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}`
        
        const response = await fetch(geocodingUrl)
        const data = await response.json()
        
        if (data.features && data.features.length > 0) {
          location.coordinates = data.features[0].center as [number, number]
        }
      }
    }

    // Calculate optimal route using Mapbox Directions API
    const directionsUrl = new URL('https://api.mapbox.com/directions/v5/mapbox/driving')
    const coordinates = `${pickupLocation.coordinates?.join(',')};${deliveryLocation.coordinates?.join(',')}`
    
    directionsUrl.searchParams.append('coordinates', coordinates)
    directionsUrl.searchParams.append('access_token', MAPBOX_TOKEN)
    directionsUrl.searchParams.append('annotations', 'duration,distance')
    directionsUrl.searchParams.append('overview', 'full')
    
    if (constraints?.avoidHighways) {
      directionsUrl.searchParams.append('exclude', 'motorway')
    }

    const routeResponse = await fetch(directionsUrl.toString())
    const routeData = await routeResponse.json()

    if (!routeData.routes || !routeData.routes[0]) {
      throw new Error('No route found')
    }

    const route = routeData.routes[0]
    let currentTime = new Date()

    // Calculate route stops
    routeStops.push({
      location: {
        address: pickupLocation.address,
        coordinates: pickupLocation.coordinates!
      },
      estimatedArrival: currentTime.toISOString(),
      distanceFromPrevious: 0,
      durationFromPrevious: 0
    })

    // Add required stops if specified
    if (constraints?.requiredStops) {
      const segmentDuration = route.duration / (constraints.requiredStops + 1)
      const segmentDistance = route.distance / (constraints.requiredStops + 1)

      for (let i = 1; i <= constraints.requiredStops; i++) {
        currentTime = new Date(currentTime.getTime() + segmentDuration * 1000)
        routeStops.push({
          location: {
            address: `Stop ${i}`,
            coordinates: [0, 0] // Would need additional logic to get exact coordinates
          },
          estimatedArrival: currentTime.toISOString(),
          distanceFromPrevious: segmentDistance,
          durationFromPrevious: segmentDuration
        })
      }
    }

    // Add final destination
    currentTime = new Date(currentTime.getTime() + route.duration * 1000)
    routeStops.push({
      location: {
        address: deliveryLocation.address,
        coordinates: deliveryLocation.coordinates!
      },
      estimatedArrival: currentTime.toISOString(),
      distanceFromPrevious: route.distance,
      durationFromPrevious: route.duration
    })

    // Return optimized route data
    return new Response(
      JSON.stringify({
        route: {
          stops: routeStops,
          totalDistance: route.distance,
          totalDuration: route.duration,
          geometry: route.geometry
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
