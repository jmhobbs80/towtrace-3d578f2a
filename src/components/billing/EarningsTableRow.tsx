
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { JobEarnings } from "@/lib/types/billing";
import { formatCurrency } from "@/lib/utils";

interface EarningsTableRowProps {
  earning: JobEarnings;
}

export function EarningsTableRow({ earning }: EarningsTableRowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <TableRow>
      <TableCell>{formatDate(earning.created_at)}</TableCell>
      <TableCell className="font-mono">{earning.job_id.slice(0, 8)}</TableCell>
      <TableCell>{formatCurrency(earning.total_amount)}</TableCell>
      <TableCell>{formatCurrency(earning.platform_fee)}</TableCell>
      <TableCell>{formatCurrency(earning.provider_amount)}</TableCell>
      <TableCell>
        <Badge
          variant={earning.status === 'processed' ? 'default' : 'secondary'}
        >
          {earning.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
