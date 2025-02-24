
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "@/components/billing/PaymentForm";
import { PaymentHistory } from "@/components/billing/PaymentHistory";
import { isLocation } from "@/lib/types/job";
import type { Job, Location } from "@/lib/types/job";

interface JobDetailsProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export const JobDetails = ({ job, open, onClose }: JobDetailsProps) => {
  if (!job) return null;

  const canProcessPayment = job.status === 'completed';
  const pickupLocation = isLocation(job.pickup_location) ? job.pickup_location as Location : null;
  const deliveryLocation = job.delivery_location && isLocation(job.delivery_location) ? job.delivery_location as Location : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Details - {job.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {pickupLocation && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Pickup Location</h4>
                  <p className="text-sm">{pickupLocation.address}</p>
                </div>
              )}
              {deliveryLocation && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Delivery Location</h4>
                  <p className="text-sm">{deliveryLocation.address}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium mb-1">Service Type</h4>
                <p className="text-sm capitalize">{job.service_type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <p className="text-sm capitalize">{job.status}</p>
              </div>
              {job.charge_amount && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Charge Amount</h4>
                  <p className="text-sm">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(job.charge_amount)}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {canProcessPayment && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Record Payment</h3>
                <PaymentForm
                  jobId={job.id}
                  organizationId={job.organization_id}
                  onSuccess={() => {
                    // Optionally refresh job data or payment history
                  }}
                />
              </div>
            )}
            
            <div className="space-y-4">
              <PaymentHistory jobId={job.id} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
