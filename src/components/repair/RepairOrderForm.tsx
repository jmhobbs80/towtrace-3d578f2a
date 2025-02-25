
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRepairOrder, createRepairItem } from '@/lib/api/repair';
import { getVehicles } from '@/lib/api/vehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import type { RepairFacility } from '@/lib/types/repair';

interface RepairOrderFormProps {
  facilities: RepairFacility[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RepairOrderForm({ facilities, onSuccess, onCancel }: RepairOrderFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState([{ type: '', description: '', estimatedCost: '' }]);

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles(),
  });

  const createOrderMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const order = await createRepairOrder({
        vehicle_id: formData.get('vehicleId') as string,
        facility_id: formData.get('facilityId') as string,
        organization_id: user?.id || '',
        estimated_completion_date: formData.get('estimatedCompletionDate') as string,
        notes: formData.get('notes') as string,
      });

      // Create repair items
      const itemPromises = items.map(item => 
        createRepairItem({
          repair_order_id: order.id,
          type: item.type,
          description: item.description,
          estimated_cost: parseFloat(item.estimatedCost),
        })
      );

      await Promise.all(itemPromises);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      toast({
        title: "Success",
        description: "Repair order has been created.",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create repair order.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createOrderMutation.mutate(formData);
  };

  const addItem = () => {
    setItems([...items, { type: '', description: '', estimatedCost: '' }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vehicleId">Vehicle</Label>
        <Select name="vehicleId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map(vehicle => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.vin})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="facilityId">Repair Facility</Label>
        <Select name="facilityId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a facility" />
          </SelectTrigger>
          <SelectContent>
            {facilities.map(facility => (
              <SelectItem key={facility.id} value={facility.id}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="estimatedCompletionDate">Estimated Completion Date</Label>
        <Input
          type="date"
          id="estimatedCompletionDate"
          name="estimatedCompletionDate"
          required
        />
      </div>

      <div>
        <Label>Repair Items</Label>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mt-2">
            <Input
              placeholder="Type"
              value={item.type}
              onChange={(e) => updateItem(index, 'type', e.target.value)}
              required
            />
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Estimated Cost"
              value={item.estimatedCost}
              onChange={(e) => updateItem(index, 'estimatedCost', e.target.value)}
              required
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={addItem}
        >
          Add Item
        </Button>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Create Repair Order</Button>
      </div>
    </form>
  );
}
