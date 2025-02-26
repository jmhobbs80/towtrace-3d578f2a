
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Help & Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>FAQ and help content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
