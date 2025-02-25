import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminAuditLog } from "@/lib/types/auth";
import { useToast } from "@/hooks/use-toast";

export default function OverwatchDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState({
    api: 'operational',
    database: 'connected'
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        // Ensure proper type conversion
        const transformedData: AdminAuditLog[] = data.map(log => ({
          id: log.id,
          user_id: log.user_id,
          action_type: log.action_type,
          entity_type: log.entity_type,
          entity_id: log.entity_id,
          previous_state: log.previous_state,
          new_state: log.new_state,
          metadata: log.metadata,
          ip_address: log.ip_address,
          created_at: log.created_at || new Date().toISOString()
        }));

        setAuditLogs(transformedData);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch audit logs"
      });
    } finally {
      setLoading(false);
    }
  };

  const suspendOrganization = async (orgId: string) => {
    try {
      // First get the organization's current state
      const { data: prevState } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      // Update organization status
      const { error } = await supabase
        .from('organizations')
        .update({ subscription_status: 'suspended' })
        .eq('id', orgId);

      if (error) throw error;

      // Log the admin action
      await supabase.rpc('log_admin_action', {
        action_type: 'suspend_organization',
        entity_type: 'organizations',
        entity_id: orgId,
        previous_state: prevState,
        new_state: { ...prevState, subscription_status: 'suspended' }
      });

      toast({
        title: "Organization Suspended",
        description: "The organization has been suspended successfully."
      });
      
      fetchAuditLogs(); // Refresh logs
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to suspend organization"
      });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TowTrace Overwatch Dashboard</CardTitle>
          <CardDescription>
            Platform-wide monitoring and management interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  View All Organizations
                </Button>
                <Button className="w-full" variant="outline">
                  Manage User Roles
                </Button>
                <Button className="w-full" variant="outline">
                  Review Flagged Transactions
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>API Status</span>
                    <span className="text-green-500">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="text-green-500">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span>Loading...</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="space-y-2">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="text-sm">
                        <p className="font-medium">{log.action_type}</p>
                        <p className="text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Audit Log Section */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track all administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{log.action_type}</h4>
                        <p className="text-sm text-muted-foreground">
                          Entity: {log.entity_type} {log.entity_id}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                    {(log.previous_state || log.new_state) && (
                      <div className="mt-2 text-sm">
                        <p>Changes:</p>
                        <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              previous: log.previous_state,
                              new: log.new_state
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
