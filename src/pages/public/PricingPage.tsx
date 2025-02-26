
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Pricing</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pricing details will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
