import { useState } from "react";
import { LocationMap } from "@/components/map/Map";
import { TowRequestForm } from "@/components/public/TowRequestForm";
import { TowDetails } from "@/components/public/TowDetails";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { PushNotificationService } from "@/lib/services/push-notifications";

export default function RequestTow() {
  const [step, setStep] = useState<'request' | 'details' | 'tracking'>('request');
  const [jobId, setJobId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleRequestSubmit = async (newJobId: string) => {
    setJobId(newJobId);
    setStep('details');
    
    // Request push notification permission
    try {
      const notificationService = PushNotificationService.getInstance();
      await notificationService.requestPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Notification Permission",
        description: "Enable notifications to receive updates about your tow request.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="h-[calc(100vh-2rem)]">
          <LocationMap jobId={jobId} />
        </div>
        <div className="space-y-4">
          <Card className="p-6">
            {step === 'request' && (
              <TowRequestForm onSubmit={handleRequestSubmit} />
            )}
            {step === 'details' && jobId && (
              <TowDetails jobId={jobId} onComplete={() => setStep('tracking')} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
