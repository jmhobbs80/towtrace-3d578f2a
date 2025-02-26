
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemOverview() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">System Overview</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System status overview will be implemented here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Active users metrics will be implemented here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System health metrics will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
