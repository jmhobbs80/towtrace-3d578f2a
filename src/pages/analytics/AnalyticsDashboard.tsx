
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { RevenueChart } from "./components/RevenueChart";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { UsageReport } from "./components/UsageReport";
import { CostAnalysis } from "./components/CostAnalysis";

export function AnalyticsDashboard() {
  const { organization } = useAuth();

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid gap-6">
        <RevenueChart />
        <PerformanceMetrics />
        <div className="grid gap-6 md:grid-cols-2">
          <UsageReport />
          <CostAnalysis />
        </div>
      </div>
    </div>
  );
}
