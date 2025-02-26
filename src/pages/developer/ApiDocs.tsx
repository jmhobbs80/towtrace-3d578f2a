
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiDocs() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <p>API documentation will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
