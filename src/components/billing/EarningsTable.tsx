
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getJobEarnings } from "@/lib/api/billing";
import { useAuth } from "@/components/auth/AuthProvider";
import type { JobEarnings } from "@/lib/types/billing";

export function EarningsTable() {
  const { organization } = useAuth();
  const [page, setPage] = useState(1);
  
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['job-earnings', organization?.id, page],
    queryFn: () => getJobEarnings(organization?.id!),
    enabled: !!organization?.id,
  });

  if (!organization?.id || isLoading) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <Table>
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
        <TableBody>
          {earnings?.map((earning: JobEarnings) => (
            <TableRow key={earning.id}>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
