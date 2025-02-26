
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SecurityLogs() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Security Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Security logs interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
