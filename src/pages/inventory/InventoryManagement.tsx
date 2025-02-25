
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Vehicle
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsBulkUploadOpen(true)}
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
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="pending">Pending Inspection</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="in_transit">In Transit</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <InventoryList 
            vehicles={vehicles}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <InventoryList 
            vehicles={vehicles.filter(v => v.status === 'pending_inspection')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="available">
          <InventoryList 
            vehicles={vehicles.filter(v => v.status === 'available')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="in_transit">
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
