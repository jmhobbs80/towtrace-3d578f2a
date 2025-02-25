import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toLocation } from "@/lib/utils";

interface Location {
  address: string;
  // Add other location properties as needed
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
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tow_jobs')
        .select(`
          *,
          profiles:profiles(first_name, last_name)
        `)
        .in('status', ['pending', 'assigned', 'en_route'])
        .order('priority', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((job: DatabaseJob) => ({
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

  if (isLoading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div>
      {/* Implement AI Dispatch UI */}
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </div>
  );
}
