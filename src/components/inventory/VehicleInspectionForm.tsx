import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  createInspection,
  updateInspectionStatus,
  addChecklistItem,
  updateChecklistItem,
  updateChecklistItemWithPhotos,
  getInspectionDetails,
} from "@/lib/api/inspections";
import type { InspectionChecklistItem, UpdateInspectionStatusParams } from "@/lib/types/inspection";
import { ChecklistItem } from "./ChecklistItem";
import { CategorySelector } from "./CategorySelector";

const CHECKLIST_CATEGORIES = [
  "Exterior",
  "Interior",
  "Mechanical",
  "Electronics",
  "Safety",
] as const;

const DEFAULT_CHECKLIST_ITEMS = {
  Exterior: ["Paint", "Body Panels", "Windows", "Lights", "Tires"],
  Interior: ["Seats", "Dashboard", "Controls", "AC/Heat", "Audio System"],
  Mechanical: ["Engine", "Transmission", "Brakes", "Steering", "Suspension"],
  Electronics: ["Battery", "Starter", "Alternator", "Wiring", "Sensors"],
  Safety: ["Airbags", "Seatbelts", "Emergency Brake", "Horn", "Mirrors"],
};

interface Props {
  vehicleId: string;
  inspectionId?: string;
  onComplete?: () => void;
}

export function VehicleInspectionForm({ vehicleId, inspectionId, onComplete }: Props) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<typeof CHECKLIST_CATEGORIES[number]>("Exterior");
  const [notes, setNotes] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<{ [key: string]: File[] }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string[] }>({});

  const { data: inspectionData, isLoading } = useQuery({
    queryKey: ['inspection', inspectionId],
    queryFn: () => inspectionId ? getInspectionDetails(inspectionId) : null,
    enabled: !!inspectionId,
  });

  const createInspectionMutation = useMutation({
    mutationFn: createInspection,
    onSuccess: () => {
      toast({
        title: "Inspection Created",
        description: "You can now start the inspection process",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateInspectionStatus,
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Inspection status has been updated successfully",
      });
      onComplete?.();
    },
  });

  const addChecklistItemMutation = useMutation({
    mutationFn: addChecklistItem,
    onSuccess: () => {
      toast({
        title: "Item Added",
        description: "Checklist item has been added successfully",
      });
    },
  });

  const updatePhotosForItemMutation = useMutation({
    mutationFn: ({ itemId, files }: { itemId: string, files: File[] }) => 
      updateChecklistItemWithPhotos(itemId, files),
    onSuccess: () => {
      toast({
        title: "Photos Updated",
        description: "Photos have been uploaded successfully",
      });
    },
  });

  const handlePhotoUpload = (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos = Array.from(files);
    setSelectedPhotos(prev => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), ...newPhotos]
    }));

    const newUrls = newPhotos.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), ...newUrls]
    }));
  };

  const removePhoto = (itemName: string, index: number) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [itemName]: prev[itemName].filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => ({
      ...prev,
      [itemName]: prev[itemName].filter((_, i) => i !== index)
    }));
  };

  const handleItemStatus = async (itemName: string, status: InspectionChecklistItem['status']) => {
    try {
      if (!inspectionId) {
        const newInspection = await createInspectionMutation.mutateAsync(vehicleId);
        const newItem = await addChecklistItemMutation.mutateAsync({
          inspection_id: newInspection.id,
          category: selectedCategory,
          item_name: itemName,
          status,
          notes,
        });

        if (selectedPhotos[itemName]?.length > 0) {
          await updatePhotosForItemMutation.mutateAsync({
            itemId: newItem.id,
            files: selectedPhotos[itemName],
          });
        }
      } else {
        const existingItem = inspectionData?.checklistItems.find(
          item => item.category === selectedCategory && item.item_name === itemName
        );

        if (existingItem) {
          await updateChecklistItem(existingItem.id, { status, notes });
          
          if (selectedPhotos[itemName]?.length > 0) {
            await updatePhotosForItemMutation.mutateAsync({
              itemId: existingItem.id,
              files: selectedPhotos[itemName],
            });
          }
        } else {
          const newItem = await addChecklistItemMutation.mutateAsync({
            inspection_id: inspectionId,
            category: selectedCategory,
            item_name: itemName,
            status,
            notes,
          });

          if (selectedPhotos[itemName]?.length > 0) {
            await updatePhotosForItemMutation.mutateAsync({
              itemId: newItem.id,
              files: selectedPhotos[itemName],
            });
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inspection item",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    if (inspectionId) {
      updateStatusMutation.mutate({
        inspectionId,
        status: 'completed'
      });
    }
  };

  if (isLoading) {
    return <div>Loading inspection details...</div>;
  }

  return (
    <div className="space-y-6">
      <CategorySelector
        categories={CHECKLIST_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelect={(category) => setSelectedCategory(category as typeof CHECKLIST_CATEGORIES[number])}
      />

      <Card>
        <CardHeader>
          <CardTitle>{selectedCategory} Inspection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {DEFAULT_CHECKLIST_ITEMS[selectedCategory].map((item) => {
              const existingItem = inspectionData?.checklistItems.find(
                i => i.category === selectedCategory && i.item_name === item
              );

              return (
                <ChecklistItem
                  key={item}
                  item={item}
                  existingItem={existingItem}
                  onStatusChange={(status) => handleItemStatus(item, status)}
                  onNotesChange={setNotes}
                  onPhotoUpload={(e) => handlePhotoUpload(item, e)}
                  onPhotoRemove={(index) => removePhoto(item, index)}
                  previewUrls={previewUrls[item]}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => updateStatusMutation.mutate({ 
            inspectionId: inspectionId!, 
            status: 'in_progress' 
          })}
          disabled={!inspectionId}
        >
          Save Progress
        </Button>
        <Button onClick={handleComplete} disabled={!inspectionId}>
          Complete Inspection
        </Button>
      </div>
    </div>
  );
}
