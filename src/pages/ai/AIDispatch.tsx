
import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Map } from "@/components/map/Map";
import { JobList } from "@/components/dispatch/JobList";
import { supabase } from "@/integrations/supabase/client";
import { Brain, AlertTriangle, Truck } from "lucide-react";
import type { Job } from "@/lib/types/job";
import { toLocation } from "@/lib/types/job";

interface RawJob {
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
  driver: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export default function AIDispatch() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const { toast } = useToast();

  // Fetch active jobs
  const { data: jobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['ai-dispatch-jobs'],
    queryFn: async () => {
      const { data: rawJobs, error } = await supabase
        .from('tow_jobs')
        .select(`
          *,
          driver:profiles(first_name, last_name)
        `)
        .in('status', ['pending', 'assigned', 'en_route'])
        .order('priority', { ascending: false });

      if (error) throw error;
      if (!rawJobs) return [];

      return (rawJobs as RawJob[]).map(job => ({
        ...job,
        pickup_location: toLocation(job.pickup_location) || { address: 'Unknown' },
        delivery_location: job.delivery_location ? toLocation(job.delivery_location) : undefined,
        driver: job.driver ? {
          first_name: job.driver.first_name || '',
          last_name: job.driver.last_name || ''
        } : undefined
      })) as Job[];
    }
  });

  // Fetch available drivers
  const { data: availableDrivers } = useQuery({
    queryKey: ['available-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, status')
        .eq('role', 'driver')
        .eq('status', 'available');
        
      if (error) throw error;
      return data;
    }
  });

  // Optimize routes mutation
  const optimizeRoutesMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await supabase.functions.invoke('optimize-route', {
        body: { jobId, manualOverride }
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      refetchJobs();
      toast({
        title: "Routes Optimized",
        description: "Job assignments have been optimized based on AI analysis",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: error.message,
      });
    }
  });

  const handleOptimizeRoutes = useCallback(async () => {
    setIsOptimizing(true);
    try {
      if (!jobs?.length) {
        throw new Error("No jobs available for optimization");
      }

      for (const job of jobs) {
        await optimizeRoutesMutation.mutateAsync(job.id);
      }
    } catch (error) {
      console.error('Error optimizing routes:', error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsOptimizing(false);
    }
  }, [jobs, optimizeRoutesMutation, toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI-Powered Dispatch
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setManualOverride(!manualOverride)}
            className={manualOverride ? "bg-yellow-50" : ""}
          >
            {manualOverride ? "Manual Override Active" : "Enable Manual Override"}
          </Button>
          <Button
            onClick={handleOptimizeRoutes}
            disabled={isOptimizing || !jobs?.length}
          >
            {isOptimizing ? "Optimizing..." : "Optimize Routes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Fleet View</span>
              {availableDrivers && (
                <Badge variant="outline" className="ml-2">
                  <Truck className="w-4 h-4 mr-1" />
                  {availableDrivers.length} Available Drivers
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Map />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <JobList 
              jobs={jobs || []} 
              isLoading={isLoadingJobs}
              isDriver={false}
            />
          </CardContent>
        </Card>
      </div>

      {manualOverride && (
        <Card className="border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              <p>Manual override mode is active. AI recommendations will be provided but not automatically applied.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
