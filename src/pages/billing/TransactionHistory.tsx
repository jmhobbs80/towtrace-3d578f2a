
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionHistory() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Transaction History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Transaction history will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
