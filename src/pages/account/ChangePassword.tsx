
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChangePassword() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Password change form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
