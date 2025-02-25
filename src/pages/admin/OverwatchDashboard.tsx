
import { useState } from "react";
import { PlatformControls } from "@/components/admin/PlatformControls";
import { BusinessVerification } from "@/components/admin/BusinessVerification";

export default function OverwatchDashboard() {
  const [autoVerification, setAutoVerification] = useState(false);

  const handleToggleAutoVerification = (enabled: boolean) => {
    setAutoVerification(enabled);
    // TODO: Implement API call to update auto-verification setting
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Overwatch Dashboard</h1>
      <div className="grid gap-6">
        <PlatformControls />
        <BusinessVerification 
          autoVerification={autoVerification}
          onToggleAutoVerification={handleToggleAutoVerification}
        />
      </div>
    </div>
  );
}
