
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserProfile() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profile management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
