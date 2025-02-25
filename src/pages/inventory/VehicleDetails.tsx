
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleDetails } from "@/lib/api/vehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { DamageReportForm } from "@/components/inventory/DamageReportForm";
import { RepairOrderForm } from "@/components/repair/RepairOrderForm";
import { useToast } from "@/components/ui/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface VehicleLocation {
  name: string;
  address: Json;
}

interface DamageReport {
  id: string;
  severity: string;
  description?: string;
  created_at: string;
}

interface TransitRecord {
  id: string;
  status: string;
  pickup_date: string;
  delivery_date?: string;
}

interface VehicleDetailsData {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string;
  condition: string;
  location: VehicleLocation | null;
  condition_logs: any[];
  damage_reports: DamageReport[];
  inspections: any[];
  transit_history: TransitRecord[];
}

export default function VehicleDetails() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [vehicle, setVehicle] = useState<VehicleDetailsData | null>(null);
  const [isDamageReportOpen, setIsDamageReportOpen] = useState(false);
  const [isRepairOrderOpen, setIsRepairOrderOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!vehicleId) {
      console.error("Vehicle ID is missing");
      return;
    }

    const fetchVehicle = async () => {
      try {
        const vehicleData = await getVehicleDetails(vehicleId);
        setVehicle({
          id: vehicleData.id,
          vin: vehicleData.vin,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          status: vehicleData.status,
          condition: vehicleData.condition,
          location: vehicleData.location,
          condition_logs: vehicleData.condition_logs || [],
          damage_reports: vehicleData.damage_reports || [],
          inspections: vehicleData.inspections || [],
          transit_history: vehicleData.transit_history || []
        });
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleDamageReportSuccess = () => {
    setIsDamageReportOpen(false);
  };

  const handleRepairOrderSubmit = async (data: any) => {
    console.log('Repair order data:', data);
    setIsRepairOrderOpen(false);
    toast({
      title: "Repair Order Created",
      description: "Your repair order has been successfully created.",
    });
  };

  if (!vehicleId) {
    return <div>Vehicle ID is required</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vehicle Details</h1>
        <Button onClick={() => navigate('/inventory')}>Back to Inventory</Button>
      </div>
      
      {vehicle && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transit History</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.transit_history?.length > 0 ? (
                  <div className="space-y-4">
                    {vehicle.transit_history.map((transit) => (
                      <div key={transit.id} className="border p-4 rounded">
                        <p>Status: {transit.status}</p>
                        <p>Pickup Date: {new Date(transit.pickup_date).toLocaleDateString()}</p>
                        <p>Delivery Date: {transit.delivery_date ? new Date(transit.delivery_date).toLocaleDateString() : 'Pending'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No transit history available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Damage Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.damage_reports?.length > 0 ? (
                  <div className="space-y-4">
                    {vehicle.damage_reports.map((report) => (
                      <div key={report.id} className="border p-4 rounded">
                        <p>Severity: {report.severity}</p>
                        <p>Date: {new Date(report.created_at).toLocaleDateString()}</p>
                        {report.description && <p>Description: {report.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No damage reports available</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>VIN:</strong> {vehicle.vin}</p>
                <p><strong>Make:</strong> {vehicle.make}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Year:</strong> {vehicle.year}</p>
                <p><strong>Status:</strong> {vehicle.status}</p>
                <p><strong>Condition:</strong> {vehicle.condition}</p>
                {vehicle.location && (
                  <p><strong>Location:</strong> {vehicle.location.name}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setIsDamageReportOpen(true)}>
              Add Damage Report
            </Button>
            <Button onClick={() => setIsRepairOrderOpen(true)}>
              Create Repair Order
            </Button>
          </div>

          {isDamageReportOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add Damage Report
                </h3>
                <div className="mt-2">
                  <DamageReportForm
                    vehicleId={vehicleId}
                    onSuccess={handleDamageReportSuccess}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setIsDamageReportOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isRepairOrderOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create Repair Order
                </h3>
                <div className="mt-2">
                  <RepairOrderForm
                    vehicleId={vehicleId}
                    onSubmit={handleRepairOrderSubmit}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setIsRepairOrderOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
