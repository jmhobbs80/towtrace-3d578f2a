
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoutRequestForm } from "@/components/billing/PayoutRequestForm";
import { EarningsOverview } from "@/components/billing/EarningsOverview";

export default function PayoutManagement() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payout Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <EarningsOverview />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Payout</CardTitle>
        </CardHeader>
        <CardContent>
          <PayoutRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
