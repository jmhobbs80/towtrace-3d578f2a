
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DamageReport } from "@/lib/api/vehicles";

interface DamageReportsCardProps {
  damageReports: DamageReport[];
}

export function DamageReportsCard({ damageReports }: DamageReportsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Damage Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {damageReports?.length > 0 ? (
          <div className="space-y-4">
            {damageReports.map((report) => (
              <div key={report.id} className="border p-4 rounded">
                <p>Severity: {report.severity}</p>
                <p>Date: {new Date(report.created_at).toLocaleDateString()}</p>
                {report.description && <p>Description: {report.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No damage reports available</p>
        )}
      </CardContent>
    </Card>
  );
}
