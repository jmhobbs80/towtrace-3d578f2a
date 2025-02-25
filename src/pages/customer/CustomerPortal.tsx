
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TowRequestForm } from "@/components/public/TowRequestForm";

export default function CustomerPortal() {
  const handleSubmit = (jobId: string) => {
    console.log('Tow request submitted:', jobId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Customer Portal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Request a Tow</CardTitle>
        </CardHeader>
        <CardContent>
          <TowRequestForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
