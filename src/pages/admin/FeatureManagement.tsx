
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureManagement() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Feature Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for feature management functionality */}
          <p className="text-muted-foreground">Feature toggle management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
