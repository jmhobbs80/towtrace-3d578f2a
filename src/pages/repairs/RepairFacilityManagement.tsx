
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRepairFacility, getRepairFacilities } from '@/lib/api/repair';
import { Button } from '@/components/ui/button';
import { RepairFacilityCard } from '@/components/repair/RepairFacilityCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import type { CreateRepairFacilityParams } from '@/lib/types/repair';

export default function RepairFacilityManagement() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: facilities = [] } = useQuery({
    queryKey: ['repair-facilities'],
    queryFn: getRepairFacilities,
  });

  const createFacilityMutation = useMutation({
    mutationFn: createRepairFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-facilities'] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Repair facility has been created.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create repair facility.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const facility: CreateRepairFacilityParams = {
      name: formData.get('name') as string,
      address: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
      },
      contact_info: {
        contact_name: formData.get('contactName') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
      },
      capacity: parseInt(formData.get('capacity') as string),
      organization_id: user?.id || '',
    };

    createFacilityMutation.mutate(facility);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Repair Facilities</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Facility</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Repair Facility</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Facility Name</Label>
                <Input id="name" name="name" required />
              </div>
              
              <div className="space-y-2">
                <Label>Address</Label>
                <Input name="street" placeholder="Street Address" required />
                <div className="grid grid-cols-2 gap-2">
                  <Input name="city" placeholder="City" required />
                  <Input name="state" placeholder="State" required />
                </div>
                <Input name="zip" placeholder="ZIP Code" required />
              </div>

              <div className="space-y-2">
                <Label>Contact Information</Label>
                <Input name="contactName" placeholder="Contact Name" />
                <Input name="phone" placeholder="Phone Number" type="tel" />
                <Input name="email" placeholder="Email" type="email" />
              </div>

              <div>
                <Label htmlFor="capacity">Vehicle Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Facility
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {facilities.map(facility => (
          <RepairFacilityCard 
            key={facility.id} 
            facility={facility} 
          />
        ))}
      </div>
    </div>
  );
}
