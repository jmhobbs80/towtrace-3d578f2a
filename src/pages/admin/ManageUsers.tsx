
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ManageUsers() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
