
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
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
import { PlatformControls } from "@/components/admin/PlatformControls";
import { BusinessVerification } from "@/components/admin/BusinessVerification";
import { AuditLog } from "@/components/admin/AuditLog";

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
        entity_id: 'global',
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

            <TabsContent value="controls">
              <PlatformControls
                platformSettings={platformSettings}
                systemHealth={systemHealth}
                onToggleFeature={togglePlatformFeature}
              />
            </TabsContent>

            <TabsContent value="verification">
              <BusinessVerification
                autoVerification={platformSettings.autoVerification}
                onToggleAutoVerification={(enabled) => togglePlatformFeature('autoVerification', enabled)}
              />
            </TabsContent>

            <TabsContent value="compliance">
              <AuditLog logs={auditLogs} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
