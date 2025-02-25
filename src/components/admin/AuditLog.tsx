
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminAuditLog } from "@/lib/types/auth";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, UserCog } from "lucide-react";
import { useState } from "react";

interface AuditLogProps {
  logs: AdminAuditLog[];
}

const getActionIcon = (actionType: string) => {
  if (actionType.includes('security') || actionType.includes('auth')) {
    return <ShieldCheck className="w-4 h-4 text-primary" />;
  }
  if (actionType.includes('warning') || actionType.includes('risk')) {
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  }
  return <UserCog className="w-4 h-4 text-muted-foreground" />;
};

export function AuditLog({ logs }: AuditLogProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const toggleLog = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.map((log) => {
            const isExpanded = expandedLogs.has(log.id);
            
            return (
              <Collapsible 
                key={log.id} 
                open={isExpanded}
                className="rounded-lg border bg-card hover:shadow-md transition-all duration-200"
              >
                <CollapsibleTrigger 
                  onClick={() => toggleLog(log.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getActionIcon(log.action_type)}
                    <div>
                      <h4 className="font-medium text-sm">{log.action_type}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2">
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        Entity: {log.entity_type} {log.entity_id}
                      </p>
                      {(log.previous_state || log.new_state) && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Changes:</p>
                          <pre className="bg-muted p-2 rounded-lg text-xs overflow-x-auto">
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
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
