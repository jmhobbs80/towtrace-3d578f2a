
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateVehicleTransitStatus } from "@/lib/api/fleet";
import { decodeVIN } from "@/lib/api/vehicles";
import type { VehicleInTransit } from "@/lib/types/fleet";

interface UpdateStatusDialogProps {
  vehicle: VehicleInTransit;
  onUpdate: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateStatusDialog = ({ vehicle, onUpdate, open, onOpenChange }: UpdateStatusDialogProps) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scannedVin, setScannedVin] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupStatus, setPickupStatus] = useState<VehicleInTransit['pickup_status']>(vehicle.pickup_status);
  const [deliveryStatus, setDeliveryStatus] = useState<VehicleInTransit['delivery_status']>(vehicle.delivery_status);
  const [vehicleData, setVehicleData] = useState<{ make: string; model: string; year: number } | null>(null);

  const handleVinScan = async () => {
    setScanning(true);
    try {
      // In a real implementation, this would come from a barcode/QR scanner
      // For demo purposes, we're using the vehicle's VIN
      const vin = vehicle.vin;
      const decodedData = await decodeVIN(vin);
      
      setScannedVin(vin);
      setVehicleData({
        make: decodedData.make,
        model: decodedData.model,
        year: decodedData.year
      });

      // Verify the scanned data matches our records
      if (decodedData.make !== vehicle.make || 
          decodedData.model !== vehicle.model || 
          decodedData.year !== vehicle.year) {
        toast({
          variant: "warning",
          title: "Vehicle Data Mismatch",
          description: "The scanned vehicle details don't match our records. Please verify the correct vehicle."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning Failed",
        description: "Failed to decode VIN. Please try again or enter manually."
      });
    } finally {
      setScanning(false);
    }
  };

  const handlePickupStatusChange = (value: string) => {
    setPickupStatus(value as VehicleInTransit['pickup_status']);
  };

  const handleDeliveryStatusChange = (value: string) => {
    setDeliveryStatus(value as VehicleInTransit['delivery_status']);
  };

  const handleSubmit = async () => {
    try {
      if (scannedVin && scannedVin !== vehicle.vin) {
        toast({
          variant: "destructive",
          title: "VIN Mismatch",
          description: "The scanned VIN does not match the vehicle record."
        });
        return;
      }

      const updates: any = {
        pickup_status: pickupStatus,
        delivery_status: deliveryStatus,
      };

      if (pickupStatus === 'confirmed' && !vehicle.pickup_confirmation) {
        updates.pickup_confirmation = new Date().toISOString();
      }
      if (deliveryStatus === 'delivered' && !vehicle.delivery_confirmation) {
        updates.delivery_confirmation = new Date().toISOString();
      }

      await updateVehicleTransitStatus(vehicle.id, updates);
      
      toast({
        title: "Status Updated",
        description: "Vehicle status has been successfully updated."
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update vehicle status."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Vehicle Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Pickup Status</Label>
            <Select value={pickupStatus} onValueChange={handlePickupStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Delivery Status</Label>
            <Select value={deliveryStatus} onValueChange={handleDeliveryStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Scan VIN</Label>
            <div className="flex gap-2">
              <Input value={scannedVin} readOnly placeholder="Scan VIN to verify" />
              <Button onClick={handleVinScan} disabled={scanning}>
                {scanning ? "Scanning..." : "Scan"}
              </Button>
            </div>
            {vehicleData && (
              <div className="text-sm text-gray-500 mt-2">
                Decoded: {vehicleData.year} {vehicleData.make} {vehicleData.model}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
