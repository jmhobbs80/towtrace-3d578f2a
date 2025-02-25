
import { useParams } from "react-router-dom";
import { JobDetails as JobDetailsComponent } from "@/components/dispatch/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function JobDetails() {
  const { jobId } = useParams();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tow_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return <JobDetailsComponent job={job} open={true} onClose={() => {}} />;
}
