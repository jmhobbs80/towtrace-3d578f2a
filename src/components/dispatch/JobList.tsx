
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { JobStatusManager } from "./JobStatusManager";
import type { Database } from "@/integrations/supabase/types";

type JobStatus = Database["public"]["Enums"]["job_status"];

interface Job {
  id: string;
  pickup_location: {
    address: string;
    coordinates: [number, number];
  };
  delivery_location?: {
    address: string;
    coordinates: [number, number];
  };
  status: JobStatus;
  driver?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
  created_at: string;
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  isDriver?: boolean;
}

export const JobList = ({ jobs, isLoading, isDriver = false }: JobListProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading jobs...</div>;
  }

  return (
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
                  initialStatus={job.status}
                  isDriver={isDriver}
                />
              </TableCell>
              <TableCell>
                {job.driver
                  ? `${job.driver.first_name || ''} ${job.driver.last_name || ''}`
                  : 'Unassigned'}
              </TableCell>
              <TableCell>
                {new Date(job.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
