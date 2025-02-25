
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryList } from "@/components/inventory/InventoryList";
import { LocationSelector } from "@/components/inventory/LocationSelector";
import { BulkUploadModal } from "@/components/inventory/BulkUploadModal";
import { AddVehicleModal } from "@/components/inventory/AddVehicleModal";
import { getInventoryVehicles, getLocations } from "@/lib/api/inventory";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import type { InventoryLocation, InventoryVehicle } from "@/lib/types/inventory";

const InventoryManagement = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const { toast } = useToast();
  const { organization } = useAuth();

  const { data: locations = [] } = useQuery<InventoryLocation[]>({
    queryKey: ['locations'],
    queryFn: getLocations,
    meta: {
      errorMessage: "Failed to load locations. Please try again."
    }
  });

  const { 
    data: vehicles = [], 
    isLoading,
    refetch: refetchVehicles
  } = useQuery<InventoryVehicle[]>({
    queryKey: ['inventory', selectedLocationId],
    queryFn: () => getInventoryVehicles(selectedLocationId),
    enabled: !!organization?.id,
    meta: {
      errorMessage: "Failed to load inventory. Please try again."
    }
  });

  const handleSuccess = () => {
    refetchVehicles();
    toast({
      title: "Success",
      description: "Inventory updated successfully",
    });
  };

  if (!organization?.id) {
    return null;
  }

  return (
    <div className="container p-8 mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
          Inventory Management
        </h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Add Vehicle
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsBulkUploadOpen(true)}
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            Bulk Upload
          </Button>
        </div>
      </div>

      <LocationSelector
        locations={locations}
        selectedId={selectedLocationId}
        onSelect={setSelectedLocationId}
      />

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="bg-card border border-border/5">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Vehicles
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Pending Inspection
          </TabsTrigger>
          <TabsTrigger 
            value="available"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Available
          </TabsTrigger>
          <TabsTrigger 
            value="in_transit"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            In Transit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <InventoryList 
            vehicles={vehicles}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <InventoryList 
            vehicles={vehicles.filter(v => v.status === 'pending_inspection')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <InventoryList 
            vehicles={vehicles.filter(v => v.status === 'available')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="in_transit" className="mt-4">
          <InventoryList 
            vehicles={vehicles.filter(v => v.status === 'in_transit')}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <AddVehicleModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        locations={locations}
      />

      <BulkUploadModal
        open={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={handleSuccess}
        locationId={selectedLocationId}
        organizationId={organization.id}
      />
    </div>
  );
};

export default InventoryManagement;
