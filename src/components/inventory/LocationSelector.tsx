
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InventoryLocation } from "@/lib/types/inventory";

interface LocationSelectorProps {
  locations: InventoryLocation[];
  selectedId?: string;
  onSelect: (locationId: string) => void;
}

export const LocationSelector = ({
  locations,
  selectedId,
  onSelect,
}: LocationSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Location:</label>
      <Select value={selectedId} onValueChange={onSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
