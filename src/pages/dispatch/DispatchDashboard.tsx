
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { JobList } from "@/components/dispatch/JobList";
import { CreateJobModal } from "@/components/dispatch/CreateJobModal";
import { useToast } from "@/components/ui/use-toast";

const fetchJobs = async () => {
  const { data, error } = await supabase
    .functions.invoke('jobs', {
      method: 'GET'
    });
  
  if (error) throw error;
  return data;
};

const DispatchDashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error fetching jobs",
      description: error.message
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dispatch Dashboard</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create New Job
            </Button>
          </div>
          
          <JobList jobs={jobs || []} isLoading={isLoading} />
          
          <CreateJobModal 
            open={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              refetch();
              setIsCreateModalOpen(false);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default DispatchDashboard;
