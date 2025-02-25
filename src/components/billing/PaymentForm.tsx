
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createInvoiceFromPayment } from "@/lib/api/invoices";
import type { PaymentMethod } from "@/lib/types/billing";
import { toLocation } from "@/lib/types/job";

interface PaymentFormProps {
  jobId: string;
  organizationId: string;
  onSuccess?: () => void;
}

interface FormData {
  amount: number;
  method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

export const PaymentForm = ({ jobId, organizationId, onSuccess }: PaymentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Create payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          ...data,
          job_id: jobId,
          organization_id: organizationId,
          status: 'processed',
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Fetch job details for invoice
      const { data: jobData, error: jobError } = await supabase
        .from('tow_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      // Convert the job data to match the Job type
      const job = {
        ...jobData,
        pickup_location: toLocation(jobData.pickup_location),
        delivery_location: toLocation(jobData.delivery_location),
      };

      // Generate invoice
      await createInvoiceFromPayment(payment, job);

      toast({
        title: "Payment recorded",
        description: "Payment has been recorded and invoice generated.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        variant: "destructive",
        title: "Error recording payment",
        description: "There was an error recording the payment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", { required: true, min: 0 })}
        />
      </div>

      <div>
        <Label htmlFor="method">Payment Method</Label>
        <Select {...register("method", { required: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="motor_club">Motor Club</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reference_number">Reference Number (Optional)</Label>
        <Input
          id="reference_number"
          {...register("reference_number")}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          {...register("notes")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Recording Payment..." : "Record Payment"}
      </Button>
    </form>
  );
}
