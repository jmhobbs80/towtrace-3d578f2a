
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function JobStatus() {
  const { toast } = useToast();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tow_jobs')
        .select('*')
        .not('status', 'eq', 'completed');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching jobs",
          description: error.message
        });
        throw error;
      }

      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Job Status</h1>
      <Card>
        <CardHeader>
          <CardTitle>Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : (
            <div className="space-y-4">
              {jobs?.map((job) => (
                <div key={job.id} className="p-4 border rounded">
                  <p>Job #{job.id} - Status: {job.status}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
