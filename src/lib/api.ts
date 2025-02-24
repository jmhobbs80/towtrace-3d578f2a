
import { supabase } from "@/integrations/supabase/client";

export const updateJobStatus = async (jobId: string, status: string) => {
  const { data, error } = await supabase.functions.invoke('jobs', {
    method: 'PATCH',
    body: { status },
    urlPath: `/${jobId}`
  });

  if (error) throw error;
  return data;
};
