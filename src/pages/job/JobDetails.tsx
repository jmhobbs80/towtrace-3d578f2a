
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
      // First, get the job details
      const { data: jobData, error: jobError } = await supabase
        .from('tow_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;

      // Then, if there's a driver_id, get the driver details
      let driverData = null;
      if (jobData.driver_id) {
        const { data: driver, error: driverError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', jobData.driver_id)
          .single();

        if (!driverError) {
          driverData = driver;
        }
      }

      const transformedJob: Job = {
        id: jobData.id,
        pickup_location: toLocation(jobData.pickup_location) || { address: 'Unknown location' },
        delivery_location: toLocation(jobData.delivery_location),
        assigned_to: jobData.driver_id,
        status: jobData.status,
        description: jobData.description,
        charge_amount: jobData.charge_amount,
        completed_at: jobData.completed_at,
        created_at: jobData.created_at,
        updated_at: jobData.updated_at,
        customer_id: jobData.customer_id,
        dispatcher_id: jobData.dispatcher_id,
        driver_id: jobData.driver_id,
        driver_notes: jobData.driver_notes,
        eta: jobData.eta,
        mileage: jobData.mileage,
        organization_id: jobData.organization_id,
        payment_status: jobData.payment_status,
        photos: jobData.photos,
        scheduled_time: jobData.scheduled_time,
        signature_url: jobData.signature_url,
        vehicle_id: jobData.vehicle_id,
        service_type: jobData.service_type,
        priority: jobData.priority,
        notes: jobData.notes,
        driver: driverData ? {
          first_name: driverData.first_name,
          last_name: driverData.last_name
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
