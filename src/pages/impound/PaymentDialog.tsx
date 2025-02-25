
import * as React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

interface PaymentForm {
  amount: number;
  method: 'cash' | 'credit_card' | 'check';
  reference_number?: string;
  notes?: string;
}

interface PaymentDialogProps {
  impoundId: string;
  currentFees: number;
  onPaymentComplete?: () => void;
}

export function PaymentDialog({ impoundId, currentFees, onPaymentComplete }: PaymentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { organization } = useAuth();
  const { toast } = useToast();
  const form = useForm<PaymentForm>({
    defaultValues: {
      amount: currentFees
    }
  });

  const onSubmit = async (data: PaymentForm) => {
    if (!organization?.id) return;

    try {
      // First create a dummy job for the payment record since job_id is required
      const { data: job, error: jobError } = await supabase
        .from('tow_jobs')
        .insert([{
          service_type: 'transport',
          pickup_location: {},
          charge_amount: data.amount,
          payment_status: 'completed',
          status: 'completed'
        }])
        .select()
        .single();

      if (jobError) throw jobError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          job_id: job.id,
          organization_id: organization.id,
          amount: data.amount,
          method: data.method,
          reference_number: data.reference_number,
          notes: data.notes,
          status: 'completed',
          processed_at: new Date().toISOString(),
          metadata: {
            impound_id: impoundId,
            payment_type: 'impound_release'
          }
        });

      if (paymentError) throw paymentError;

      // Update impounded vehicle status
      const { error: impoundError } = await supabase
        .from('impounded_vehicles')
        .update({
          status: 'pending_release',
          total_fees: 0 // Reset fees after payment
        })
        .eq('id', impoundId);

      if (impoundError) throw impoundError;

      toast({
        title: "Payment Successful",
        description: "Payment has been processed and recorded.",
      });

      setOpen(false);
      form.reset();
      onPaymentComplete?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <DollarSign className="mr-2 h-4 w-4" />
          Process Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...form.register("amount", {
                required: true,
                min: 0,
                valueAsNumber: true
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select onValueChange={(value) => form.setValue("method", value as PaymentForm["method"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference_number">Reference Number</Label>
            <Input
              id="reference_number"
              {...form.register("reference_number")}
              placeholder="Check number, transaction ID, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              {...form.register("notes")}
              placeholder="Any additional payment notes"
            />
          </div>

          <Button type="submit" className="w-full">Process Payment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
