
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureFlags() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Feature Flags</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Feature flags management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
