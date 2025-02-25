
import * as React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface AddImpoundLotForm {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  capacity: number;
  daily_rate: number;
  late_fee_rate: number;
}

export function AddImpoundLotDialog() {
  const [open, setOpen] = React.useState(false);
  const { organization } = useAuth();
  const { toast } = useToast();
  const form = useForm<AddImpoundLotForm>();

  const onSubmit = async (data: AddImpoundLotForm) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('impound_lots')
        .insert({
          name: data.name,
          organization_id: organization.id,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip
          },
          capacity: data.capacity,
          daily_rate: data.daily_rate,
          late_fee_rate: data.late_fee_rate
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Impound lot has been added successfully.",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add impound lot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Impound Lot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Impound Lot</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name", { required: true })}
              placeholder="Main Street Impound"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              {...form.register("street", { required: true })}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...form.register("city", { required: true })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...form.register("state", { required: true })}
                placeholder="State"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              {...form.register("zip", { required: true })}
              placeholder="12345"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                {...form.register("capacity", { required: true, min: 1 })}
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily_rate">Daily Rate ($)</Label>
              <Input
                id="daily_rate"
                type="number"
                step="0.01"
                {...form.register("daily_rate", { required: true, min: 0 })}
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="late_fee_rate">Late Fee Rate ($)</Label>
            <Input
              id="late_fee_rate"
              type="number"
              step="0.01"
              {...form.register("late_fee_rate", { required: true, min: 0 })}
              placeholder="25.00"
            />
          </div>

          <Button type="submit" className="w-full">Add Impound Lot</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
