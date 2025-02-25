
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function UserManagement() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load users: {error.message}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="mt-4">
                {users && users.length > 0 ? (
                  <DataTable data={users} />
                ) : (
                  <p className="text-muted-foreground">No users found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
