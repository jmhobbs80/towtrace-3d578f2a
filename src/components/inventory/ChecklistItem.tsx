
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageIcon, X } from "lucide-react";
import type { InspectionChecklistItem } from "@/lib/types/inspection";
import { PhotoPreview } from "./PhotoPreview";

interface ChecklistItemProps {
  item: string;
  existingItem?: InspectionChecklistItem;
  onStatusChange: (status: InspectionChecklistItem['status']) => void;
  onNotesChange: (notes: string) => void;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (index: number) => void;
  previewUrls?: string[];
}

export function ChecklistItem({
  item,
  existingItem,
  onStatusChange,
  onNotesChange,
  onPhotoUpload,
  onPhotoRemove,
  previewUrls = [],
}: ChecklistItemProps) {
  return (
    <div className="space-y-2">
      <Label>{item}</Label>
      <RadioGroup
        defaultValue={existingItem?.status}
        onValueChange={(value) => onStatusChange(value as InspectionChecklistItem['status'])}
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
        onChange={(e) => onNotesChange(e.target.value)}
      />

      <div className="mt-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={`photos-${item}`} className="cursor-pointer">
            <div className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
              <ImageIcon className="w-4 h-4" />
              <span>Add Photos</span>
            </div>
          </Label>
          <Input
            type="file"
            id={`photos-${item}`}
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPhotoUpload}
          />
        </div>

        <PhotoPreview
          urls={previewUrls}
          itemName={item}
          onRemove={onPhotoRemove}
        />
      </div>
    </div>
  );
}
