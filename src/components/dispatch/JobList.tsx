
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobStatusManager } from "./JobStatusManager";
import { JobDetails } from "./JobDetails";
import { useState } from "react";
import type { Job, Location, isLocation } from "@/lib/types/job";
import type { Database } from "@/integrations/supabase/types";

type JobStatus = Database["public"]["Enums"]["job_status"];

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  isDriver?: boolean;
}

export const JobList = ({ jobs, isLoading, isDriver = false }: JobListProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (isLoading) {
    return <div className="text-center py-4">Loading jobs...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Pickup Location</TableHead>
              <TableHead>Delivery Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const pickupLocation = isLocation(job.pickup_location) ? job.pickup_location as Location : null;
              const deliveryLocation = job.delivery_location && isLocation(job.delivery_location) ? job.delivery_location as Location : null;

              return (
                <TableRow key={job.id}>
                  <TableCell className="font-mono">{job.id.slice(0, 8)}</TableCell>
                  <TableCell>{pickupLocation?.address || 'Unknown'}</TableCell>
                  <TableCell>{deliveryLocation?.address || 'N/A'}</TableCell>
                  <TableCell>
                    <JobStatusManager 
                      jobId={job.id}
                      initialStatus={job.status as JobStatus}
                      isDriver={isDriver}
                    />
                  </TableCell>
                  <TableCell>
                    {job.driver_id
                      ? `${job.driver?.first_name || ''} ${job.driver?.last_name || ''}`
                      : 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    {new Date(job.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <JobDetails
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </>
  );
};
