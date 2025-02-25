
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TowRequestForm } from "@/components/public/TowRequestForm";
import { PaymentForm } from "@/components/billing/PaymentForm";

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleRequestSubmit = (submittedJobId: string) => {
    setJobId(submittedJobId);
    setStep(2);
  };

  const handlePaymentSubmit = () => {
    setStep(3);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Book a Tow</h1>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TowRequestForm onSubmit={handleRequestSubmit} />
          </CardContent>
        </Card>
      )}

      {step === 2 && jobId && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm jobId={jobId} organizationId="default" onSuccess={handlePaymentSubmit} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
