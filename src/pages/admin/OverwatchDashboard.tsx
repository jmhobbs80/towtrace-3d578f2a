
import { useState } from "react";
import { PlatformControls } from "@/components/admin/PlatformControls";
import { BusinessVerification } from "@/components/admin/BusinessVerification";
import { Shield } from "lucide-react";
import { Logo } from "@/components/branding/Logo";

export default function OverwatchDashboard() {
  const [autoVerification, setAutoVerification] = useState(false);

  const handleToggleAutoVerification = (enabled: boolean) => {
    setAutoVerification(enabled);
    // TODO: Implement API call to update auto-verification setting
  };

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-display font-bold tracking-tight">Overwatch Dashboard</h1>
        </div>
        <Logo variant="icon" size="sm" className="opacity-50" />
      </div>
      
      <div className="grid gap-8">
        <div className="rounded-2xl bg-card p-6 shadow-lg border border-border/5 transition-all hover:shadow-xl">
          <PlatformControls />
        </div>
        
        <div className="rounded-2xl bg-card p-6 shadow-lg border border-border/5 transition-all hover:shadow-xl">
          <BusinessVerification 
            autoVerification={autoVerification}
            onToggleAutoVerification={handleToggleAutoVerification}
          />
        </div>
      </div>
    </div>
  );
}
