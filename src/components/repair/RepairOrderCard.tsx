
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { RepairOrder, RepairItem } from "@/lib/types/repair";

interface RepairOrderCardProps {
  order: RepairOrder & {
    facility: { name: string; address: any };
    items: RepairItem[];
  };
  onStatusUpdate?: (orderId: string, status: RepairItem["status"]) => void;
}

export function RepairOrderCard({ order, onStatusUpdate }: RepairOrderCardProps) {
  const isCompleted = order.status === 'completed';
  const totalItems = order.items?.length || 0;
  const completedItems = order.items?.filter(item => item.status === 'completed').length || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Repair Order #{order.id.slice(0, 8)}
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {order.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Facility</p>
              <p>{order.facility.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p>{completedItems} / {totalItems} items</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Est. Completion</p>
              <p>{order.estimated_completion_date ? 
                new Date(order.estimated_completion_date).toLocaleDateString() : 
                'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
              <p>{formatCurrency(order.total_cost || 0)}</p>
            </div>
          </div>

          {!isCompleted && onStatusUpdate && (
            <Button 
              className="w-full"
              onClick={() => onStatusUpdate(order.id, 'completed')}
            >
              Mark as Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
