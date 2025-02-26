
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Sandbox() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">API Sandbox</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <p>API testing sandbox will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
