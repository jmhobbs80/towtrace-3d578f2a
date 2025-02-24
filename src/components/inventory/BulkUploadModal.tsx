
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { bulkAddVehicles } from "@/lib/api/inventory";
import type { BulkUploadRow } from "@/lib/types/inventory";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locationId?: string;
}

export const BulkUploadModal = ({
  open,
  onClose,
  onSuccess,
  locationId,
}: BulkUploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n').slice(1); // Skip header row
        const vehicles: BulkUploadRow[] = rows
          .filter(row => row.trim())
          .map(row => {
            const [vin, make, model, year, trim, color, mileage, purchase_price, listing_price, notes] = row.split(',');
            return {
              vin: vin.trim(),
              make: make.trim(),
              model: model.trim(),
              year: parseInt(year.trim(), 10),
              trim: trim?.trim(),
              color: color?.trim(),
              mileage: mileage ? parseInt(mileage.trim(), 10) : undefined,
              purchase_price: purchase_price ? parseFloat(purchase_price.trim()) : undefined,
              listing_price: listing_price ? parseFloat(listing_price.trim()) : undefined,
              notes: notes?.trim(),
            };
          });

        await bulkAddVehicles(vehicles, locationId);
        onSuccess();
        onClose();
        toast({
          title: "Success",
          description: `Uploaded ${vehicles.length} vehicles`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error uploading vehicles",
          description: error.message,
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Vehicles</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns:
            VIN, Make, Model, Year, Trim, Color, Mileage, Purchase Price, Listing Price, Notes
          </p>

          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <Button
            variant="outline"
            onClick={() => {
              const template = "VIN,Make,Model,Year,Trim,Color,Mileage,Purchase Price,Listing Price,Notes\n";
              const blob = new Blob([template], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'inventory_template.csv';
              a.click();
            }}
          >
            Download Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
