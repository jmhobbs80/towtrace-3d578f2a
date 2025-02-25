
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationSwitcher } from "@/components/organization/OrganizationSwitcher";

export default function OrganizationDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Organization Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationSwitcher />
        </CardContent>
      </Card>
    </div>
  );
}
