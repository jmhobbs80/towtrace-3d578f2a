
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function CostAnalysis() {
  const { organization } = useAuth();

  const { data: costData } = useQuery({
    queryKey: ['cost-analysis', organization?.id],
    queryFn: () => {
      // TODO: Implement API endpoint for cost analysis
      return [
        { name: 'Fuel', value: 35 },
        { name: 'Maintenance', value: 25 },
        { name: 'Insurance', value: 20 },
        { name: 'Platform Fees', value: 15 },
        { name: 'Other', value: 5 },
      ];
    },
    enabled: !!organization?.id,
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={costData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {costData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
