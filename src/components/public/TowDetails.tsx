
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Truck, Check } from "lucide-react";
import type { Job } from "@/lib/types/job";
import { toLocation } from "@/lib/types/job";
import type { Database } from "@/integrations/supabase/types";

interface TowDetailsProps {
  jobId: string;
  onComplete: () => void;
}

type TowJobRow = Database["public"]["Tables"]["tow_jobs"]["Row"];

export function TowDetails({ jobId, onComplete }: TowDetailsProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`job-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tow_jobs',
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          const rawJob = payload.new as TowJobRow;
          
          if (!rawJob) return;
          
          // Convert the raw job data to match our Job type
          const updatedJob: Job = {
            ...rawJob,
            charge_amount: rawJob.charge_amount || 0,
            completed_at: rawJob.completed_at || null,
            created_at: rawJob.created_at || new Date().toISOString(),
            customer_id: rawJob.customer_id || null,
            description: rawJob.description || '',
            dispatcher_id: rawJob.dispatcher_id || null,
            driver_id: rawJob.driver_id || null,
            driver_notes: rawJob.driver_notes || '',
            eta: rawJob.eta || null,
            id: rawJob.id,
            mileage: rawJob.mileage || null,
            notes: rawJob.notes || '',
            organization_id: rawJob.organization_id,
            payment_status: rawJob.payment_status || 'pending',
            photos: rawJob.photos || [],
            priority: rawJob.priority || 3,
            scheduled_time: rawJob.scheduled_time || null,
            service_type: rawJob.service_type,
            signature_url: rawJob.signature_url || null,
            status: rawJob.status || 'pending',
            updated_at: rawJob.updated_at || new Date().toISOString(),
            vehicle_id: rawJob.vehicle_id || null,
            pickup_location: toLocation(rawJob.pickup_location) || { address: 'Unknown location' },
            delivery_location: toLocation(rawJob.delivery_location),
          };
          
          setJob(updatedJob);
          
          if (updatedJob.status === 'completed') {
            onComplete();
          }

          // Show notifications based on status changes
          const notifications: Record<string, string> = {
            assigned: 'Tow Truck Assigned',
            en_route: 'Driver En Route',
            completed: 'Tow Completed',
          };

          if (notifications[updatedJob.status]) {
            toast({
              title: notifications[updatedJob.status],
              description: `Your tow request status has been updated to ${updatedJob.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, onComplete, toast]);

  useEffect(() => {
    // Fetch initial job details
    const fetchJob = async () => {
      const { data: rawJob, error } = await supabase
        .from('tow_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching job details",
          description: error.message,
        });
        return;
      }

      if (!rawJob) return;

      // Convert the raw job data to match our Job type
      const job: Job = {
        ...rawJob,
        charge_amount: rawJob.charge_amount || 0,
        completed_at: rawJob.completed_at || null,
        created_at: rawJob.created_at || new Date().toISOString(),
        customer_id: rawJob.customer_id || null,
        description: rawJob.description || '',
        dispatcher_id: rawJob.dispatcher_id || null,
        driver_id: rawJob.driver_id || null,
        driver_notes: rawJob.driver_notes || '',
        eta: rawJob.eta || null,
        id: rawJob.id,
        mileage: rawJob.mileage || null,
        notes: rawJob.notes || '',
        organization_id: rawJob.organization_id,
        payment_status: rawJob.payment_status || 'pending',
        photos: rawJob.photos || [],
        priority: rawJob.priority || 3,
        scheduled_time: rawJob.scheduled_time || null,
        service_type: rawJob.service_type,
        signature_url: rawJob.signature_url || null,
        status: rawJob.status || 'pending',
        updated_at: rawJob.updated_at || new Date().toISOString(),
        vehicle_id: rawJob.vehicle_id || null,
        pickup_location: toLocation(rawJob.pickup_location) || { address: 'Unknown location' },
        delivery_location: toLocation(rawJob.delivery_location),
      };

      setJob(job);
    };

    fetchJob();
  }, [jobId, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'en_route':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'completed':
        return <Check className="h-6 w-6 text-green-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  if (!job) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Request Status</h3>
          <p className="text-sm text-gray-500">ID: {jobId}</p>
        </div>
        {getStatusIcon(job.status)}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Pickup Location</p>
          <p className="font-medium">{job.pickup_location.address}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Delivery Location</p>
          <p className="font-medium">{job.delivery_location?.address}</p>
        </div>

        {eta && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              Estimated arrival in {Math.ceil(eta / 60)} minutes
            </p>
          </div>
        )}

        {job.status === 'completed' && (
          <Button onClick={onComplete} className="w-full">
            View Receipt
          </Button>
        )}
      </div>
    </div>
  );
}
