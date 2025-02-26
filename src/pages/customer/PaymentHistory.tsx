
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentHistory() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payment history available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
