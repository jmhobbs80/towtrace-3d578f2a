
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { createPayment } from "@/lib/api/payments";
import type { PaymentMethod } from "@/lib/types/billing";

interface PaymentFormProps {
  jobId: string;
  organizationId: string;
  onSuccess?: () => void;
}

export const PaymentForm = ({ jobId, organizationId, onSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    method: "credit_card" as PaymentMethod,
    reference_number: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createPayment({
        job_id: jobId,
        organization_id: organizationId,
        amount: Number(formData.amount),
        method: formData.method,
        reference_number: formData.reference_number || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Payment recorded successfully",
      });

      onSuccess?.();
      
      // Reset form
      setFormData({
        amount: "",
        method: "credit_card",
        reference_number: "",
        notes: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error recording payment",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select
          value={formData.method}
          onValueChange={(value: PaymentMethod) =>
            setFormData((prev) => ({ ...prev, method: value }))
          }
        >
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

      <div className="space-y-2">
        <Label htmlFor="reference">Reference Number (Optional)</Label>
        <Input
          id="reference"
          value={formData.reference_number}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, reference_number: e.target.value }))
          }
          placeholder="e.g., Check number, Authorization code"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional payment details"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Record Payment"}
      </Button>
    </form>
  );
};
