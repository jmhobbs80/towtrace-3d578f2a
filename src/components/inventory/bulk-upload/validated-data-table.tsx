
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { VehicleData } from "./types";

interface ValidatedDataTableProps {
  vehicles: VehicleData[];
}

export function ValidatedDataTable({ vehicles }: ValidatedDataTableProps) {
  if (vehicles.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-green-600">
        Valid Entries ({vehicles.length})
      </h3>
      <div className="max-h-40 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>VIN</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle, index) => (
              <TableRow key={index}>
                <TableCell>{vehicle.vin}</TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
