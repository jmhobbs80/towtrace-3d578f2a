
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
import type { Database } from "@/integrations/supabase/types";

type JobStatus = Database["public"]["Enums"]["job_status"];
type Job = Database["public"]["Tables"]["tow_jobs"]["Row"];

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
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono">{job.id.slice(0, 8)}</TableCell>
                <TableCell>{job.pickup_location.address}</TableCell>
                <TableCell>{job.delivery_location?.address || 'N/A'}</TableCell>
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
            ))}
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
