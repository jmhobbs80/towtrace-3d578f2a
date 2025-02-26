
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
        <div className="space-y-4">
          {policeReportNumber && (
            <div className="flex justify-between">
              <span className="font-semibold">Police Report #:</span>
              <span>{policeReportNumber}</span>
            </div>
          )}
          {insuranceClaimNumber && (
            <div className="flex justify-between">
              <span className="font-semibold">Insurance Claim #:</span>
              <span>{insuranceClaimNumber}</span>
            </div>
          )}
          {!policeReportNumber && !insuranceClaimNumber && (
            <p className="text-gray-500 text-center">No documentation available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
