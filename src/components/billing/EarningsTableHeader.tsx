
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function EarningsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Job ID</TableHead>
        <TableHead>Total Amount</TableHead>
        <TableHead>Platform Fee</TableHead>
        <TableHead>Your Earnings</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
  );
}
