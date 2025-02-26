
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemNotices() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">System Notices</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p>System notices will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
