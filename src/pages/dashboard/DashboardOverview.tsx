
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealerDashboard } from "./DealerDashboard";
import { TransporterDashboard } from "./TransporterDashboard";
import { useAuth } from "@/components/auth/AuthProvider";

export function DashboardOverview() {
  const { organization } = useAuth();

  if (!organization) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please select an organization to view the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return organization.type === 'transporter' ? (
    <TransporterDashboard />
  ) : (
    <DealerDashboard />
  );
}
