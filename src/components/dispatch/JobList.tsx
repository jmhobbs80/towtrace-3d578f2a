
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateJobStatus } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

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
  status: string;
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'assigned':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const JobList = ({ jobs, isLoading }: JobListProps) => {
  const { toast } = useToast();

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast({
        title: "Status updated",
        description: `Job status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    }
  };

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
                <Select
                  defaultValue={job.status}
                  onValueChange={(value) => handleStatusChange(job.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {job.driver
                  ? `${job.driver.first_name} ${job.driver.last_name}`
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
