
import { useQuery } from "@tanstack/react-query";
import { getJobPayments } from "@/lib/api/payments";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@/lib/types/billing";

interface PaymentHistoryProps {
  jobId: string;
}

export const PaymentHistory = ({ jobId }: PaymentHistoryProps) => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', jobId],
    queryFn: () => getJobPayments(jobId),
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading payments...</div>;
  }

  if (!payments?.length) {
    return <div className="text-center py-4 text-muted-foreground">No payments recorded</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment History</h3>
      <div className="space-y-2">
        {payments.map((payment: Payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 bg-background rounded-lg border"
          >
            <div className="space-y-1">
              <div className="font-medium">{formatCurrency(payment.amount)}</div>
              <div className="text-sm text-muted-foreground">
                {payment.method} - {formatDate(payment.created_at)}
              </div>
              {payment.reference_number && (
                <div className="text-sm text-muted-foreground">
                  Ref: {payment.reference_number}
                </div>
              )}
            </div>
            <Badge variant={payment.status === 'pending' ? 'secondary' : 'default'}>
              {payment.status}
            </Badge>
          </div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground text-right">
        Total: {formatCurrency(payments.reduce((sum, payment) => sum + payment.amount, 0))}
      </div>
    </div>
  );
};
