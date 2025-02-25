
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BusinessVerificationProps {
  autoVerification: boolean;
  onToggleAutoVerification: (enabled: boolean) => void;
}

export function BusinessVerification({ 
  autoVerification,
  onToggleAutoVerification
}: BusinessVerificationProps) {
  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Business Verification Settings</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-verification">Automatic Verification</Label>
          <Switch
            id="auto-verification"
            checked={autoVerification}
            onCheckedChange={onToggleAutoVerification}
          />
        </div>
      </CardContent>
    </div>
  );
}
