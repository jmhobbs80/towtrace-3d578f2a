
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  pickupAddress: string;
  deliveryAddress: string;
  description: string;
  driverId: string;
}

export const CreateJobModal = ({ open, onClose, onSuccess }: CreateJobModalProps) => {
  const { organization } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState<FormData>({
    pickupAddress: "",
    deliveryAddress: "",
    description: "",
    driverId: "",
  });

  const fetchDrivers = useCallback(async () => {
    if (!organization?.id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('role', 'driver')
      .eq('organization_id', organization.id);

    if (error) {
      console.error('Error fetching drivers:', error);
      toast({
        variant: "destructive",
        title: "Error fetching drivers",
        description: error.message,
      });
      return;
    }

    setDrivers(data || []);
  }, [organization?.id]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No organization found",
      });
      return;
    }

    setIsLoading(true);
    try {
      await supabase.functions.invoke('jobs', {
        method: 'POST',
        body: {
          organization_id: organization.id,
          pickup_location: {
            address: formData.pickupAddress,
            coordinates: [0, 0],
          },
          delivery_location: formData.deliveryAddress ? {
            address: formData.deliveryAddress,
            coordinates: [0, 0],
          } : undefined,
          description: formData.description,
          driver_id: formData.driverId || undefined,
          status: formData.driverId ? 'assigned' : 'pending',
        },
      });

      toast({
        title: "Success",
        description: `Job created successfully${formData.driverId ? ' and assigned to driver' : ''}`,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating job",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Pickup Location</Label>
            <Input
              id="pickupAddress"
              required
              value={formData.pickupAddress}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pickupAddress: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Location (Optional)</Label>
            <Input
              id="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="driver">Assign Driver (Optional)</Label>
            <Select
              value={formData.driverId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, driverId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {`${driver.first_name} ${driver.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
