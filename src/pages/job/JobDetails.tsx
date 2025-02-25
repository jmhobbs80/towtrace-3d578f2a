
import { useParams } from "react-router-dom";
import { JobDetails as JobDetailsComponent } from "@/components/dispatch/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toLocation } from "@/lib/types/job";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { Job } from "@/lib/types/job";

export default function JobDetails() {
  const { jobId } = useParams();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tow_jobs')
        .select(`
          *,
          driver:driver_id(
            first_name,
            last_name
          )
        `)
        .eq('id', jobId)
        .single();
      
      if (error) throw error;

      const transformedJob: Job = {
        id: data.id,
        pickup_location: toLocation(data.pickup_location) || { address: 'Unknown location' },
        delivery_location: toLocation(data.delivery_location),
        assigned_to: data.driver_id,
        status: data.status,
        description: data.description,
        charge_amount: data.charge_amount,
        completed_at: data.completed_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        customer_id: data.customer_id,
        dispatcher_id: data.dispatcher_id,
        driver_id: data.driver_id,
        driver_notes: data.driver_notes,
        eta: data.eta,
        mileage: data.mileage,
        organization_id: data.organization_id,
        payment_status: data.payment_status,
        photos: data.photos,
        scheduled_time: data.scheduled_time,
        signature_url: data.signature_url,
        vehicle_id: data.vehicle_id,
        service_type: data.service_type,
        priority: data.priority,
        notes: data.notes,
        driver: data.driver ? {
          first_name: data.driver.first_name,
          last_name: data.driver.last_name
        } : undefined
      };

      return transformedJob;
    }
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <div>Error loading job details</div>;
  if (!job) return <div>Job not found</div>;

  return <JobDetailsComponent job={job} open={true} onClose={() => {}} />;
}
