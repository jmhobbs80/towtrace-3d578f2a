
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { updateJobStatus } from "@/lib/api";
import type { Database } from "@/integrations/supabase/types";

type JobStatus = Database["public"]["Enums"]["job_status"];

interface JobStatusManagerProps {
  jobId: string;
  initialStatus: JobStatus;
  isDriver?: boolean;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "en_route", label: "En Route" },
  { value: "on_site", label: "On Site" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "assigned":
      return "bg-blue-100 text-blue-800";
    case "en_route":
      return "bg-purple-100 text-purple-800";
    case "on_site":
      return "bg-indigo-100 text-indigo-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const JobStatusManager = ({ jobId, initialStatus, isDriver = false }: JobStatusManagerProps) => {
  const [status, setStatus] = useState<JobStatus>(initialStatus);
  const { toast } = useToast();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('job-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tow_jobs',
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          const newStatus = payload.new.status as JobStatus;
          setStatus(newStatus);
          toast({
            title: "Job Status Updated",
            description: `Job status changed to ${newStatus}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, toast]);

  const handleStatusChange = async (newStatus: JobStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
      setStatus(newStatus);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    }
  };

  // Filter available status options based on current status and user role
  const getAvailableStatuses = () => {
    if (isDriver) {
      switch (status) {
        case "assigned":
          return ["en_route", "cancelled"];
        case "en_route":
          return ["on_site", "cancelled"];
        case "on_site":
          return ["completed", "cancelled"];
        default:
          return [];
      }
    }
    return statusOptions.map(option => option.value);
  };

  const availableStatuses = getAvailableStatuses();

  if (availableStatuses.length === 0) {
    return (
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
    );
  }

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as JobStatus)}
    >
      <SelectTrigger className="w-32">
        <SelectValue>
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions
          .filter(option => availableStatuses.includes(option.value))
          .map(option => (
            <SelectItem key={option.value} value={option.value}>
              <Badge className={getStatusColor(option.value)}>
                {option.label}
              </Badge>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
