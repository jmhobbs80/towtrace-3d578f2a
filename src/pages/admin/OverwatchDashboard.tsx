
import { PlatformControls } from "@/components/admin/PlatformControls";
import { BusinessVerification } from "@/components/admin/BusinessVerification";

export default function OverwatchDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Overwatch Dashboard</h1>
      <div className="grid gap-6">
        <PlatformControls />
        <BusinessVerification />
      </div>
    </div>
  );
}
