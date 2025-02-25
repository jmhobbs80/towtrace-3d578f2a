
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverVehicleStatus } from "@/components/fleet/DriverVehicleStatus";

export default function DriverPortal() {
  const { user } = useAuth();

  if (!user?.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Driver Portal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverVehicleStatus driverId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
