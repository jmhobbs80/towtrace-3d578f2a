
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { requestPayout } from "@/lib/api/billing";
import { useAuth } from "@/components/auth/AuthProvider";

interface PayoutFormData {
  amount: number;
  payout_method: string;
}

export function PayoutRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<PayoutFormData>();

  const onSubmit = async (data: PayoutFormData) => {
    if (!organization?.id) return;
    
    setIsSubmitting(true);
    try {
      await requestPayout({
        organization_id: organization.id,
        ...data,
      });

      toast({
        title: "Payout request submitted",
        description: "Your payout request has been submitted for processing.",
      });

      // Invalidate balance and payouts queries
      queryClient.invalidateQueries({ queryKey: ['provider-balance'] });
      queryClient.invalidateQueries({ queryKey: ['provider-payouts'] });
      
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error requesting payout",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Payout Amount
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          {...register("amount", { required: true, min: 0 })}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="payout_method" className="text-sm font-medium">
          Payout Method
        </label>
        <Select {...register("payout_method", { required: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payout method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Requesting Payout..." : "Request Payout"}
      </Button>
    </form>
  );
}
