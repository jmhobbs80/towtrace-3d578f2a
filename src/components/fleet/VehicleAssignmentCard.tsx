
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import type { VehicleAssignment } from "@/lib/types/fleet";

interface VehicleAssignmentCardProps {
  assignment: VehicleAssignment;
  onComplete?: () => void;
}

export function VehicleAssignmentCard({ assignment, onComplete }: VehicleAssignmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Assignment Details
          <Badge className={getStatusColor(assignment.status)}>
            {assignment.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p>{assignment.started_at ? format(new Date(assignment.started_at), 'PPp') : 'Not started'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ended</p>
            <p>{assignment.ended_at ? format(new Date(assignment.ended_at), 'PPp') : 'Active'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">Pre-trip completed</span>
          </div>
          {assignment.status === 'completed' && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Post-trip completed</span>
            </div>
          )}
        </div>

        {assignment.status === 'active' && (
          <Button onClick={onComplete} className="w-full">
            Complete Assignment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
