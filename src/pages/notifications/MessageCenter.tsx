
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MessageCenter() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Message list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
