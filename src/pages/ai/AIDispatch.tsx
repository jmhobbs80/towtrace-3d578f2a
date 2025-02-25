import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toLocation } from "@/lib/utils";
import { useRouteOptimization } from "@/hooks/use-route-optimization";
import { Button } from "@/components/ui/button";
import { LocationMap } from "@/components/map/Map";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Location {
  address: string;
  coordinates?: [number, number];
}

interface DatabaseJob {
  id: string;
  pickup_location: any;
  delivery_location?: any;
  status: string;
  description?: string;
  charge_amount?: number;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
  customer_id?: string;
  dispatcher_id?: string;
  driver_id?: string;
  driver_notes?: string;
  eta?: number;
  mileage?: number;
  organization_id: string;
  payment_status?: string;
  photos?: string[];
  scheduled_time?: string;
  signature_url?: string;
  vehicle_id?: string;
  notes?: string;
  service_type?: string;
  priority?: number;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface Job extends Omit<DatabaseJob, 'pickup_location' | 'delivery_location'> {
  pickup_location: Location;
  delivery_location?: Location;
  driver?: {
    first_name: string;
    last_name: string;
  };
}

export default function AIDispatch() {
  const { optimizeRoute, isOptimizing, optimizedRoute } = useRouteOptimization();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const { data: jobData, error } = await supabase
        .from('tow_jobs')
        .select(`
          *,
          profiles:profiles(first_name, last_name)
        `)
        .in('status', ['pending', 'assigned', 'en_route'])
        .order('priority', { ascending: false });

      if (error) throw error;
      if (!jobData) return [];

      return jobData.map((job: any): Job => ({
        ...job,
        pickup_location: toLocation(job.pickup_location) || { address: 'Unknown' },
        delivery_location: job.delivery_location ? toLocation(job.delivery_location) : undefined,
        driver: job.profiles ? {
          first_name: job.profiles.first_name || '',
          last_name: job.profiles.last_name || ''
        } : undefined
      }));
    },
  });

  const handleOptimizeRoute = async (job: Job) => {
    if (!job.pickup_location.coordinates || !job.delivery_location?.coordinates) {
      toast.error("Missing location coordinates");
      return;
    }

    try {
      const result = await optimizeRoute({
        startLocation: {
          lat: job.pickup_location.coordinates[0],
          lng: job.pickup_location.coordinates[1]
        },
        endLocation: {
          lat: job.delivery_location.coordinates[0],
          lng: job.delivery_location.coordinates[1]
        },
        preferences: {
          urgency: job.priority === 1 ? 'high' : job.priority === 2 ? 'medium' : 'low',
          vehicleType: job.service_type as any
        }
      });

      // Update job with optimized route data
      await supabase
        .from('tow_jobs')
        .update({
          eta: result.eta.getTime(),
          mileage: result.distance,
          driver_notes: `Optimized route available. ETA: ${result.eta.toLocaleTimeString()}`
        })
        .eq('id', job.id);

    } catch (error) {
      console.error('Route optimization error:', error);
      toast.error("Failed to optimize route");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Dispatch</h1>
      </div>

      {optimizedRoute && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Optimized Route</h2>
          <div className="h-[400px] mb-4">
            <LocationMap
              initialCenter={[
                optimizedRoute.waypoints[0].lat,
                optimizedRoute.waypoints[0].lng
              ]}
              initialZoom={12}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Distance</p>
              <p>{Math.round(optimizedRoute.distance / 1000)} km</p>
            </div>
            <div>
              <p className="font-medium">Duration</p>
              <p>{Math.round(optimizedRoute.duration / 60)} minutes</p>
            </div>
            <div>
              <p className="font-medium">ETA</p>
              <p>{optimizedRoute.eta.toLocaleTimeString()}</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono">{job.id.slice(0, 8)}</TableCell>
                <TableCell>{job.pickup_location.address}</TableCell>
                <TableCell>{job.delivery_location?.address}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.priority}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOptimizeRoute(job)}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      'Optimize Route'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
