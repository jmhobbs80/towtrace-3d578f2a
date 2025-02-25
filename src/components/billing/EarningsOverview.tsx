
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderBalance, getJobEarnings } from "@/lib/api/billing";
import { useAuth } from "@/components/auth/AuthProvider";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

export function EarningsOverview() {
  const { organization } = useAuth();
  
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['provider-balance', organization?.id],
    queryFn: () => getProviderBalance(organization?.id!),
    enabled: !!organization?.id,
  });

  const { data: earnings, isLoading: isLoadingEarnings } = useQuery({
    queryKey: ['job-earnings', organization?.id],
    queryFn: () => getJobEarnings(organization?.id!),
    enabled: !!organization?.id,
  });

  if (!organization?.id) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingBalance ? (
            <Skeleton className="h-7 w-[120px]" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(balance?.available_balance || 0)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingBalance ? (
            <Skeleton className="h-7 w-[120px]" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(balance?.total_earnings || 0)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingBalance ? (
            <Skeleton className="h-7 w-[120px]" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(balance?.pending_balance || 0)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
