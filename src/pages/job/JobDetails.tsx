
import { useParams } from "react-router-dom";
import { JobDetails as JobDetailsComponent } from "@/components/dispatch/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toLocation } from "@/lib/types/job";
import type { Job } from "@/lib/types/job";

export default function JobDetails() {
  const { jobId } = useParams();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tow_jobs')
        .select('*, driver:driver_id(first_name, last_name)')
        .eq('id', jobId)
        .single();
      
      if (error) throw error;

      // Transform the data to match Job type
      const transformedJob: Job = {
        ...data,
        pickup_location: toLocation(data.pickup_location) || { address: 'Unknown location' },
        delivery_location: toLocation(data.delivery_location),
        assigned_to: data.driver_id
      };

      return transformedJob;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return <JobDetailsComponent job={job} open={true} onClose={() => {}} />;
}
