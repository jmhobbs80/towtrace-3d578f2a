
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentCardProps {
  totalFees: number;
  status: string;
  onPaymentClick?: () => void;
}

export function PaymentCard({ totalFees, status, onPaymentClick }: PaymentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fees and Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Fees:</span>
            <span className="text-xl">${totalFees.toLocaleString()}</span>
          </div>
          {status === 'waiting_for_payment' && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={onPaymentClick}
            >
              Pay Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
