
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Car, DollarSign, MapPin } from "lucide-react";

interface TowRequestFormProps {
  onSubmit: (jobId: string) => void;
}

interface FormData {
  pickup_location: string;
  delivery_location: string;
  service_type: 'light_duty' | 'heavy_duty' | 'roadside_assistance';
}

export function TowRequestForm({ onSubmit }: TowRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, watch } = useForm<FormData>();

  // Watch form values for real-time cost estimation
  const formValues = watch();

  // Calculate estimated cost based on service type and distance
  const calculateEstimate = async (data: Partial<FormData>) => {
    if (!data.pickup_location || !data.delivery_location || !data.service_type) return;

    try {
      const { data: estimate } = await supabase.functions.invoke('calculate-tow-cost', {
        body: { 
          pickup_location: data.pickup_location,
          delivery_location: data.delivery_location,
          service_type: data.service_type
        }
      });
      
      setEstimatedCost(estimate.cost);
    } catch (error) {
      console.error('Error calculating estimate:', error);
    }
  };

  const onFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: job, error } = await supabase.functions.invoke('jobs', {
        method: 'POST',
        body: {
          pickup_location: {
            address: data.pickup_location,
          },
          delivery_location: {
            address: data.delivery_location,
          },
          service_type: data.service_type,
          status: 'pending',
        },
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Looking for available tow trucks...",
      });

      onSubmit(job.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error submitting request",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Pickup Location"
            className="pl-10"
            {...register("pickup_location", { required: true })}
            onChange={(e) => calculateEstimate({ ...formValues, pickup_location: e.target.value })}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Delivery Location"
            className="pl-10"
            {...register("delivery_location", { required: true })}
            onChange={(e) => calculateEstimate({ ...formValues, delivery_location: e.target.value })}
          />
        </div>

        <div className="relative">
          <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Select
            {...register("service_type", { required: true })}
            onValueChange={(value) => calculateEstimate({ ...formValues, service_type: value as any })}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light_duty">Light Duty Tow</SelectItem>
              <SelectItem value="heavy_duty">Heavy Duty Tow</SelectItem>
              <SelectItem value="roadside_assistance">Roadside Assistance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {estimatedCost && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-5 w-5 mr-2" />
            Estimated Cost
          </div>
          <div className="text-lg font-semibold">${estimatedCost.toFixed(2)}</div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting Request..." : "Request Tow"}
      </Button>
    </form>
  );
}
