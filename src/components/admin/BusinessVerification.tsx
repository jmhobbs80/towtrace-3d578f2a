
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

interface BusinessVerificationProps {
  autoVerification: boolean;
  onToggleAutoVerification: (enabled: boolean) => void;
}

export function BusinessVerification({
  autoVerification,
  onToggleAutoVerification,
}: BusinessVerificationProps) {
  return (
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
            checked={autoVerification}
            onCheckedChange={onToggleAutoVerification}
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
  );
}
