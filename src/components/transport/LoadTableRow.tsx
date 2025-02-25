
import { format } from "date-fns";
import { MapPin, Calendar, Package, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Load } from "@/lib/types/load";

interface LoadTableRowProps {
  load: Load;
  onOptimize: (load: Load) => void;
  isOptimizing: boolean;
}

export function LoadTableRow({ load, onOptimize, isOptimizing }: LoadTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{load.title}</div>
          <div className="text-sm text-gray-500">{load.description}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          <Package className="w-4 h-4 mr-1" />
          {load.load_type}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {load.pickup_location.address}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(load.pickup_date), "MMM d, yyyy")}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {load.delivery_location.address}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(load.delivery_date), "MMM d, yyyy")}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {load.price_range ? (
          <span>
            ${load.price_range.min} - ${load.price_range.max}
          </span>
        ) : (
          "Contact for price"
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant={
            load.status === "open"
              ? "default"
              : load.status === "assigned"
              ? "secondary"
              : "outline"
          }
        >
          {load.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOptimize(load)}
            disabled={isOptimizing}
          >
            <Route className="w-4 h-4 mr-1" />
            Optimize Route
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
