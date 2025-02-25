
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminAuditLog } from "@/lib/types/auth";

interface AuditLogProps {
  logs: AdminAuditLog[];
}

export function AuditLog({ logs }: AuditLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
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
  );
}
