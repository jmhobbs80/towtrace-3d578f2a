
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function UsageReport() {
  const { organization } = useAuth();

  const { data: usageData } = useQuery({
    queryKey: ['usage-metrics', organization?.id],
    queryFn: () => {
      // TODO: Implement API endpoint for usage metrics
      return [
        { month: 'Jan', jobs: 45, fleet: 85 },
        { month: 'Feb', jobs: 52, fleet: 88 },
        { month: 'Mar', jobs: 61, fleet: 92 },
        { month: 'Apr', jobs: 58, fleet: 90 },
        { month: 'May', jobs: 63, fleet: 94 },
        { month: 'Jun', jobs: 69, fleet: 96 },
      ];
    },
    enabled: !!organization?.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Report</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usageData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jobs" name="Job Volume" fill="#3b82f6" />
            <Bar dataKey="fleet" name="Fleet Activity" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
