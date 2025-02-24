
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  createInspection,
  updateInspectionStatus,
  addChecklistItem,
  updateChecklistItem,
  getInspectionDetails,
} from "@/lib/api/inspections";
import type { InspectionChecklistItem } from "@/lib/types/inspection";

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

  const handleItemStatus = async (itemName: string, status: InspectionChecklistItem['status']) => {
    if (!inspectionId) {
      const newInspection = await createInspectionMutation.mutateAsync(vehicleId);
      await addChecklistItemMutation.mutateAsync({
        inspection_id: newInspection.id,
        category: selectedCategory,
        item_name: itemName,
        status,
        notes,
      });
    } else {
      // Find existing item and update it
      const existingItem = inspectionData?.checklistItems.find(
        item => item.category === selectedCategory && item.item_name === itemName
      );

      if (existingItem) {
        await updateChecklistItem(existingItem.id, { status, notes });
      } else {
        await addChecklistItemMutation.mutateAsync({
          inspection_id: inspectionId,
          category: selectedCategory,
          item_name: itemName,
          status,
          notes,
        });
      }
    }
  };

  const handleComplete = () => {
    if (inspectionId) {
      updateStatusMutation.mutate({ inspectionId, status: 'completed' });
    }
  };

  if (isLoading) {
    return <div>Loading inspection details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        {CHECKLIST_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

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
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  <RadioGroup
                    defaultValue={existingItem?.status}
                    onValueChange={(value) => 
                      handleItemStatus(item, value as InspectionChecklistItem['status'])
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pass" id={`${item}-pass`} />
                      <Label htmlFor={`${item}-pass`}>Pass</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fail" id={`${item}-fail`} />
                      <Label htmlFor={`${item}-fail`}>Fail</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="needs_repair" id={`${item}-repair`} />
                      <Label htmlFor={`${item}-repair`}>Needs Repair</Label>
                    </div>
                  </RadioGroup>
                  <Input
                    placeholder="Notes"
                    value={existingItem?.notes || ""}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
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
