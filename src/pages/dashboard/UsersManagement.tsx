
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UsersManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
