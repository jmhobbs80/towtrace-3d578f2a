
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { getJobEarnings } from "@/lib/api/billing";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function RevenueChart() {
  const { organization } = useAuth();

  const { data: earnings } = useQuery({
    queryKey: ['job-earnings', organization?.id],
    queryFn: () => getJobEarnings(organization?.id!),
    enabled: !!organization?.id,
  });

  // Process earnings data for the chart
  const chartData = earnings?.reduce((acc: any[], earning) => {
    const date = new Date(earning.created_at).toLocaleDateString();
    const existingDay = acc.find(item => item.date === date);
    
    if (existingDay) {
      existingDay.revenue += earning.provider_amount;
      existingDay.expenses += earning.platform_fee;
      existingDay.profit = existingDay.revenue - existingDay.expenses;
    } else {
      acc.push({
        date,
        revenue: earning.provider_amount,
        expenses: earning.platform_fee,
        profit: earning.provider_amount - earning.platform_fee
      });
    }
    
    return acc;
  }, []) || [];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="2"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.2}
              name="Expenses"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stackId="3"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              name="Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
