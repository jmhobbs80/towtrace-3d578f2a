
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Shield, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OverwatchDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState({
    api: 'operational',
    database: 'connected'
  });
  const [platformSettings, setPlatformSettings] = useState({
    jobsEnabled: true,
    paymentsEnabled: true,
    registrationEnabled: true,
    autoVerification: false
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

  const togglePlatformFeature = async (feature: string, enabled: boolean) => {
    try {
      // Log the action
      await supabase.rpc('log_admin_action', {
        action_type: `toggle_${feature}`,
        entity_type: 'platform_settings',
        previous_state: { [feature]: !enabled },
        new_state: { [feature]: enabled }
      });

      setPlatformSettings(prev => ({
        ...prev,
        [feature]: enabled
      }));

      toast({
        title: "Setting Updated",
        description: `${feature} has been ${enabled ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update platform settings"
      });
    }
  };

  const forceCompleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('tow_jobs')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job Force Completed",
        description: "The job has been marked as completed"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to force complete job"
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
          <Tabs defaultValue="controls" className="space-y-4">
            <TabsList>
              <TabsTrigger value="controls">Platform Controls</TabsTrigger>
              <TabsTrigger value="verification">Business Verification</TabsTrigger>
              <TabsTrigger value="compliance">Compliance & Audit</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Global System Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Job Operations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable all job operations platform-wide
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.jobsEnabled}
                      onCheckedChange={(checked) => togglePlatformFeature('jobsEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payment Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Control all payment processing activities
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.paymentsEnabled}
                      onCheckedChange={(checked) => togglePlatformFeature('paymentsEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Registrations</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow or block new business registrations
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.registrationEnabled}
                      onCheckedChange={(checked) => togglePlatformFeature('registrationEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>API Status</span>
                      <span className="text-green-500">
                        <CheckCircle2 className="h-4 w-4 inline mr-1" />
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database</span>
                      <span className="text-green-500">
                        <CheckCircle2 className="h-4 w-4 inline mr-1" />
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span>Loading...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Verification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic verification for businesses meeting basic criteria
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.autoVerification}
                      onCheckedChange={(checked) => togglePlatformFeature('autoVerification', checked)}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Example Towing LLC</TableCell>
                        <TableCell>
                          <span className="text-yellow-500">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>3/4 Submitted</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Review</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audit Log</CardTitle>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
