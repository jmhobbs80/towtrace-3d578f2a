
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TwoFactorSettings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Two-Factor Authentication</h1>
      <Card>
        <CardHeader>
          <CardTitle>2FA Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>2FA configuration interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
