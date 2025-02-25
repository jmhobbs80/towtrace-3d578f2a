
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Load } from "@/lib/types/load";
import { LoadTableRow } from "./LoadTableRow";

interface LoadTableProps {
  loads: Load[];
  onOptimize: (load: Load) => void;
  isOptimizing: boolean;
}

export function LoadTable({ loads, onOptimize, isOptimizing }: LoadTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Load Details</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Pickup</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead>Price Range</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loads.map((load) => (
          <LoadTableRow
            key={load.id}
            load={load}
            onOptimize={onOptimize}
            isOptimizing={isOptimizing}
          />
        ))}
      </TableBody>
    </Table>
  );
}
