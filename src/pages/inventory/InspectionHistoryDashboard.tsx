
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getInspectionHistory } from "@/lib/api/inspections";
import type { VehicleInspection } from "@/lib/types/inspection";
import { useToast } from "@/hooks/use-toast";

export default function InspectionHistoryDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: inspections, isLoading, error } = useQuery({
    queryKey: ['inspections'],
    queryFn: () => getInspectionHistory(),
  });

  if (isLoading) {
    return <div>Loading inspection history...</div>;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load inspection history",
      variant: "destructive",
    });
    return null;
  }

  const getStatusColor = (status: VehicleInspection['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vehicle Inspection History</CardTitle>
            <Button onClick={() => navigate('/inventory/new-inspection')}>
              New Inspection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections?.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>
                    {format(new Date(inspection.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{inspection.vehicle_id}</TableCell>
                  <TableCell>{inspection.inspector_id}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(inspection.status)}>
                      {inspection.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/inventory/inspections/${inspection.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
