
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompanySettings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Company Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Company settings interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
