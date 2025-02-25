
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/branding/Logo";
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Logo variant="icon" size="sm" className="opacity-50" />
      </div>
      
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
