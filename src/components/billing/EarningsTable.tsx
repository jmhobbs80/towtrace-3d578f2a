
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { getJobEarnings } from "@/lib/api/billing";
import { useAuth } from "@/components/auth/AuthProvider";
import { EarningsTableHeader } from "./EarningsTableHeader";
import { EarningsTableRow } from "./EarningsTableRow";
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

  return (
    <div className="space-y-4">
      <Table>
        <EarningsTableHeader />
        <TableBody>
          {earnings?.map((earning: JobEarnings) => (
            <EarningsTableRow key={earning.id} earning={earning} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
