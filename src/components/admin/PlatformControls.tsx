
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface PlatformControlsProps {
  platformSettings: {
    jobsEnabled: boolean;
    paymentsEnabled: boolean;
    registrationEnabled: boolean;
  };
  systemHealth: {
    api: string;
    database: string;
  };
  onToggleFeature: (feature: string, enabled: boolean) => void;
}

export function PlatformControls({
  platformSettings,
  systemHealth,
  onToggleFeature,
}: PlatformControlsProps) {
  return (
    <div className="space-y-4">
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
              onCheckedChange={(checked) => onToggleFeature('jobsEnabled', checked)}
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
              onCheckedChange={(checked) => onToggleFeature('paymentsEnabled', checked)}
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
              onCheckedChange={(checked) => onToggleFeature('registrationEnabled', checked)}
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
                {systemHealth.api}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-500">
                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                {systemHealth.database}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span>Loading...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
