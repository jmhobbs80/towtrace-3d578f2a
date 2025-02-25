
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ValidationError } from "./types";

interface ValidationErrorsTableProps {
  errors: ValidationError[];
}

export function ValidationErrorsTable({ errors }: ValidationErrorsTableProps) {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-destructive">
        Validation Errors ({errors.length})
      </h3>
      <div className="max-h-40 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Row</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error, index) => (
              <TableRow key={index}>
                <TableCell>{error.row}</TableCell>
                <TableCell>{error.vin}</TableCell>
                <TableCell>{error.error}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
