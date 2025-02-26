
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleDetails } from "@/lib/api/vehicles";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TransitHistoryCard } from "@/components/inventory/vehicle/TransitHistoryCard";
import { DamageReportsCard } from "@/components/inventory/vehicle/DamageReportsCard";
import { VehicleInfoCard } from "@/components/inventory/vehicle/VehicleInfoCard";
import { ActionModals } from "@/components/inventory/vehicle/ActionModals";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
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

// Loading skeleton component for vehicle details
const VehicleDetailsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
    
    <Skeleton className="h-[300px] w-full" />
    
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
      <Skeleton className="h-10 w-full sm:w-[140px]" />
      <Skeleton className="h-10 w-full sm:w-[140px]" />
    </div>
  </div>
);

export default function VehicleDetails() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [vehicle, setVehicle] = useState<VehicleDetailsData | null>(null);
  const [isDamageReportOpen, setIsDamageReportOpen] = useState(false);
  const [isRepairOrderOpen, setIsRepairOrderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!vehicleId) {
      console.error("Vehicle ID is missing");
      return;
    }

    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vehicle details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, toast]);

  const handleDamageReportSuccess = () => {
    setIsDamageReportOpen(false);
    // Refresh vehicle data after successful damage report submission
    if (vehicleId) {
      setIsLoading(true);
      getVehicleDetails(vehicleId)
        .then(data => {
          setVehicle(data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleRepairOrderSubmit = async (data: { vehicleId?: string; facilityId?: string; estimatedCompletionDate?: string; notes?: string; }) => {
    try {
      console.log('Repair order data:', data);
      setIsRepairOrderOpen(false);
      toast({
        title: "Repair Order Created",
        description: "Your repair order has been successfully created.",
      });
    } catch (error) {
      console.error('Error creating repair order:', error);
      toast({
        title: "Error",
        description: "Failed to create repair order",
        variant: "destructive",
      });
    }
  };

  if (!vehicleId) {
    return <div>Vehicle ID is required</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {isLoading ? (
        <VehicleDetailsSkeleton />
      ) : vehicle ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Vehicle Details</h1>
            <Button onClick={() => navigate('/inventory')}>Back to Inventory</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button 
              className="w-full sm:w-auto" 
              onClick={() => setIsDamageReportOpen(true)}
            >
              Add Damage Report
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => setIsRepairOrderOpen(true)}
            >
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
        </div>
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
      )}
    </div>
  );
}
