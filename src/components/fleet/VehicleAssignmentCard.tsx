
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VehicleAssignment } from "@/lib/types/fleet";

interface VehicleAssignmentCardProps {
  assignment: VehicleAssignment;
  onComplete?: () => void;
}

export function VehicleAssignmentCard({ assignment, onComplete }: VehicleAssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Assignment Details
          <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
            {assignment.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p>{assignment.started_at ? new Date(assignment.started_at).toLocaleDateString() : 'Not started'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ended</p>
            <p>{assignment.ended_at ? new Date(assignment.ended_at).toLocaleDateString() : 'Active'}</p>
          </div>
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
