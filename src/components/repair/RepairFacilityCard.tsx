
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RepairFacility } from "@/lib/types/repair";

interface RepairFacilityCardProps {
  facility: RepairFacility;
  activeRepairs?: number;
}

export function RepairFacilityCard({ facility, activeRepairs = 0 }: RepairFacilityCardProps) {
  const address = facility.address as { street: string; city: string; state: string; zip: string };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {facility.name}
          <Badge variant={activeRepairs >= (facility.capacity || 0) ? "destructive" : "default"}>
            {activeRepairs} / {facility.capacity || "∞"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {address.street}<br />
            {address.city}, {address.state} {address.zip}
          </p>
          {facility.contact_info && (
            <div className="text-sm">
              <p>{(facility.contact_info as any).contact_name}</p>
              <p>{(facility.contact_info as any).phone}</p>
              <p>{(facility.contact_info as any).email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
