
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SystemLogs() {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['system-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
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
        <h1 className="text-3xl font-bold">System Logs</h1>
        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load system logs: {error.message}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="mt-4">
                {logs && logs.length > 0 ? (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="border-b pb-4">
                        <p className="font-medium">{log.action_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No system logs found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
