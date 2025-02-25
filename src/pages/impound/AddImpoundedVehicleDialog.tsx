
import * as React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface AddImpoundedVehicleForm {
  vin: string;
  make: string;
  model: string;
  year: string;
  lot_id: string;
  police_report_number?: string;
  insurance_claim_number?: string;
  notes?: string;
}

export function AddImpoundedVehicleDialog() {
  const [open, setOpen] = React.useState(false);
  const { organization } = useAuth();
  const { toast } = useToast();
  const form = useForm<AddImpoundedVehicleForm>();

  const { data: lots } = useQuery({
    queryKey: ['impoundLots', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impound_lots')
        .select('id, name, capacity')
        .eq('organization_id', organization?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id
  });

  const onSubmit = async (data: AddImpoundedVehicleForm) => {
    if (!organization?.id) return;

    try {
      // First create the vehicle record
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('inventory_vehicles')
        .insert({
          vin: data.vin,
          make: data.make,
          model: data.model,
          year: parseInt(data.year),
          organization_id: organization.id,
          status: 'impounded'
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Get the daily rate from the selected lot
      const { data: lotData, error: lotError } = await supabase
        .from('impound_lots')
        .select('daily_rate')
        .eq('id', data.lot_id)
        .single();

      if (lotError) throw lotError;

      // Then create the impound record
      const { error: impoundError } = await supabase
        .from('impounded_vehicles')
        .insert({
          vehicle_id: vehicleData.id,
          lot_id: data.lot_id,
          organization_id: organization.id,
          police_report_number: data.police_report_number,
          insurance_claim_number: data.insurance_claim_number,
          notes: data.notes,
          daily_rate: lotData.daily_rate,
          status: 'impounded'
        });

      if (impoundError) throw impoundError;

      toast({
        title: "Success",
        description: "Vehicle has been impounded successfully.",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to impound vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Impound Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Impound New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              {...form.register("vin", { required: true })}
              placeholder="Vehicle Identification Number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                {...form.register("make", { required: true })}
                placeholder="Make"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                {...form.register("model", { required: true })}
                placeholder="Model"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              {...form.register("year", { 
                required: true,
                min: 1900,
                max: new Date().getFullYear() + 1
              })}
              placeholder="Year"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lot_id">Impound Lot</Label>
            <Select 
              onValueChange={(value) => form.setValue("lot_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an impound lot" />
              </SelectTrigger>
              <SelectContent>
                {lots?.map((lot) => (
                  <SelectItem key={lot.id} value={lot.id}>
                    {lot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="police_report_number">Police Report Number</Label>
            <Input
              id="police_report_number"
              {...form.register("police_report_number")}
              placeholder="Police Report #"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance_claim_number">Insurance Claim Number</Label>
            <Input
              id="insurance_claim_number"
              {...form.register("insurance_claim_number")}
              placeholder="Insurance Claim #"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Additional notes about the vehicle"
            />
          </div>

          <Button type="submit" className="w-full">Impound Vehicle</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
