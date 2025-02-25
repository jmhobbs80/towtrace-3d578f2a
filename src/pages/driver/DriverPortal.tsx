
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { DriverVehicleStatus } from "@/components/fleet/DriverVehicleStatus";
import { PreTripInspectionForm } from "@/components/fleet/PreTripInspectionForm";
import { PostTripInspectionForm } from "@/components/fleet/PostTripInspectionForm";

export default function DriverPortal() {
  const { user } = useAuth();

  const { data: currentAssignment } = useQuery({
    queryKey: ['driver-assignment', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_assignments')
        .select(`
          *,
          vehicle:vehicle_id (
            id,
            make,
            model,
            year,
            license_plate
          )
        `)
        .eq('driver_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (!user?.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Driver Portal</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <DriverVehicleStatus driverId={user.id} />
          </CardContent>
        </Card>

        {currentAssignment && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Pre-Trip Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <PreTripInspectionForm vehicleId={currentAssignment.vehicle_id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Post-Trip Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <PostTripInspectionForm 
                  vehicleId={currentAssignment.vehicle_id}
                  assignmentId={currentAssignment.id} 
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
