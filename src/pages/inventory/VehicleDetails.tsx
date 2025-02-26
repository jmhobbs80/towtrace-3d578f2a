
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleDetails } from "@/lib/api/vehicles";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TransitHistoryCard } from "@/components/inventory/vehicle/TransitHistoryCard";
import { DamageReportsCard } from "@/components/inventory/vehicle/DamageReportsCard";
import { VehicleInfoCard } from "@/components/inventory/vehicle/VehicleInfoCard";
import { ActionModals } from "@/components/inventory/vehicle/ActionModals";
import type { DamageReport, TransitRecord, VehicleLocation } from "@/lib/api/vehicles";

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
            <TransitHistoryCard transitHistory={vehicle.transit_history} />
            <DamageReportsCard damageReports={vehicle.damage_reports} />
          </div>

          <VehicleInfoCard
            vin={vehicle.vin}
            make={vehicle.make}
            model={vehicle.model}
            year={vehicle.year}
            status={vehicle.status}
            condition={vehicle.condition}
            location={vehicle.location}
          />

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setIsDamageReportOpen(true)}>
              Add Damage Report
            </Button>
            <Button onClick={() => setIsRepairOrderOpen(true)}>
              Create Repair Order
            </Button>
          </div>

          <ActionModals
            vehicleId={vehicleId}
            isDamageReportOpen={isDamageReportOpen}
            isRepairOrderOpen={isRepairOrderOpen}
            onDamageReportClose={() => setIsDamageReportOpen(false)}
            onRepairOrderClose={() => setIsRepairOrderOpen(false)}
            onDamageReportSuccess={handleDamageReportSuccess}
            onRepairOrderSubmit={handleRepairOrderSubmit}
          />
        </>
      )}
    </div>
  );
}
