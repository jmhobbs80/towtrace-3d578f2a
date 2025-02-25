
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentationCardProps {
  policeReportNumber?: string;
  insuranceClaimNumber?: string;
}

export function DocumentationCard({ policeReportNumber, insuranceClaimNumber }: DocumentationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {policeReportNumber && (
            <p className="text-gray-600">
              Police Report #: {policeReportNumber}
            </p>
          )}
          {insuranceClaimNumber && (
            <p className="text-gray-600">
              Insurance Claim #: {insuranceClaimNumber}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
