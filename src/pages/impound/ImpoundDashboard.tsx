
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Car, Warehouse, DollarSign } from "lucide-react";
import { AddImpoundLotDialog } from "./AddImpoundLotDialog";
import { AddImpoundedVehicleDialog } from "./AddImpoundedVehicleDialog";
import { ReleaseVehicleDialog } from "./ReleaseVehicleDialog";

interface ImpoundedVehicle {
  id: string;
  status: 'impounded' | 'waiting_for_payment' | 'pending_release' | 'released' | 'unclaimed';
  impound_date: string;
  total_fees: number;
  vehicle_id: string;
  police_report_number?: string;
  insurance_claim_number?: string;
}

interface ImpoundLot {
  id: string;
  name: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  capacity: number;
  daily_rate: number;
}

export default function ImpoundDashboard() {
  const { organization } = useAuth();
  const { data: vehicles, refetch: refetchVehicles } = useQuery({
    queryKey: ['impoundedVehicles', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impounded_vehicles')
        .select(`
          id,
          status,
          impound_date,
          total_fees,
          vehicle_id,
          police_report_number,
          insurance_claim_number,
          inventory_vehicles(make, model, year)
        `)
        .eq('organization_id', organization?.id)
        .not('status', 'eq', 'released');
      
      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id
  });

  const { data: lots } = useQuery({
    queryKey: ['impoundLots', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impound_lots')
        .select('*')
        .eq('organization_id', organization?.id);
      
      if (error) throw error;
      
      return data as ImpoundLot[];
    },
    enabled: !!organization?.id
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Impound Management</h1>
        <div className="flex gap-2">
          <AddImpoundedVehicleDialog />
          <AddImpoundLotDialog />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Impounded
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles?.filter(v => v.status === 'impounded').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Spaces
            </CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lots?.reduce((acc, lot) => acc + (lot.capacity || 0), 0) - (vehicles?.length || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Outstanding Fees
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${vehicles?.reduce((acc, vehicle) => acc + (vehicle.total_fees || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Impound Date</TableHead>
              <TableHead>Days in Storage</TableHead>
              <TableHead>Total Fees</TableHead>
              <TableHead>Police Report #</TableHead>
              <TableHead>Insurance Claim #</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles?.map((vehicle) => {
              const daysInStorage = Math.ceil(
                (new Date().getTime() - new Date(vehicle.impound_date).getTime()) / 
                (1000 * 60 * 60 * 24)
              );
              
              return (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    {vehicle.inventory_vehicles?.year} {vehicle.inventory_vehicles?.make} {vehicle.inventory_vehicles?.model}
                  </TableCell>
                  <TableCell className="capitalize">
                    {vehicle.status.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    {new Date(vehicle.impound_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{daysInStorage}</TableCell>
                  <TableCell>${vehicle.total_fees.toLocaleString()}</TableCell>
                  <TableCell>{vehicle.police_report_number || '-'}</TableCell>
                  <TableCell>{vehicle.insurance_claim_number || '-'}</TableCell>
                  <TableCell>
                    {vehicle.status === 'impounded' && (
                      <ReleaseVehicleDialog 
                        impoundId={vehicle.id}
                        onRelease={refetchVehicles}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
