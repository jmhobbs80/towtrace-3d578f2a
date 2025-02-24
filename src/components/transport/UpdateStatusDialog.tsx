
import { useState, useEffect } from "react";
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
import { decodeVIN, validateVIN, createVINScanner, type VINScannerHardware } from "@/lib/api/vehicles";
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
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [scanner, setScanner] = useState<VINScannerHardware | null>(null);

  // Initialize scanner hardware
  useEffect(() => {
    const initScanner = async () => {
      try {
        const scannerHardware = await createVINScanner();
        setScanner(scannerHardware);
      } catch (error) {
        console.error('Failed to initialize VIN scanner:', error);
      }
    };

    initScanner();
  }, []);

  const handleVinScan = async () => {
    if (!scanner) {
      toast({
        variant: "destructive",
        title: "Scanner Not Available",
        description: "No VIN scanner hardware was detected. Please enter VIN manually."
      });
      return;
    }

    setScanning(true);
    try {
      const scannedVin = await scanner.startScanning();
      
      // Validate VIN format
      if (!validateVIN(scannedVin)) {
        toast({
          variant: "destructive",
          title: "Invalid VIN",
          description: "The scanned VIN appears to be invalid. Please try again or enter manually."
        });
        return;
      }

      const decodedData = await decodeVIN(scannedVin);
      setScannedVin(scannedVin);
      setVehicleData(decodedData);

      // Comprehensive vehicle verification
      const mismatchFields = [];
      if (decodedData.make !== vehicle.make) mismatchFields.push('make');
      if (decodedData.model !== vehicle.model) mismatchFields.push('model');
      if (decodedData.year !== vehicle.year) mismatchFields.push('year');
      
      if (mismatchFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Vehicle Data Mismatch",
          description: `Mismatched fields: ${mismatchFields.join(', ')}. Please verify the correct vehicle.`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning Failed",
        description: error instanceof Error ? error.message : "Failed to scan VIN. Please try again or enter manually."
      });
    } finally {
      setScanning(false);
      if (scanner) {
        await scanner.stopScanning();
      }
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
              <div className="space-y-2 text-sm text-gray-500 mt-2">
                <div>Vehicle: {vehicleData.year} {vehicleData.make} {vehicleData.model}</div>
                <div>Trim: {vehicleData.trim}</div>
                <div>Body: {vehicleData.bodyClass}</div>
                <div>Engine: {vehicleData.engineSize}L {vehicleData.engineCylinders}cyl</div>
                <div>Fuel: {vehicleData.fuelType}</div>
                <div>Origin: {vehicleData.plantCountry}</div>
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
