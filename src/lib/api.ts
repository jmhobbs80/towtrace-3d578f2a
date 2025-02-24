
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type JobStatus = Database["public"]["Enums"]["job_status"];

export const updateJobStatus = async (jobId: string, status: JobStatus) => {
  const { data, error } = await supabase.functions.invoke(`jobs/${jobId}`, {
    method: 'PATCH',
    body: { status }
  });

  if (error) throw error;
  return data;
};
