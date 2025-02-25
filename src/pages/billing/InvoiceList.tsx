
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentHistory } from "@/components/billing/PaymentHistory";

export default function InvoiceList() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentHistory />
        </CardContent>
      </Card>
    </div>
  );
}
