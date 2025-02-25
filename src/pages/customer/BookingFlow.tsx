
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TowRequestForm } from "@/components/public/TowRequestForm";
import { PaymentForm } from "@/components/billing/PaymentForm";

export default function BookingFlow() {
  const [step, setStep] = useState(1);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Book a Tow</h1>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TowRequestForm onComplete={() => setStep(2)} />
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm onComplete={() => setStep(3)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
