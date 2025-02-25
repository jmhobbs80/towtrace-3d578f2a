import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransporterRating } from "@/components/transport/TransporterRating";
import type { Job } from "@/lib/types/job";

interface JobDetailsProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetails({ job, open, onClose }: JobDetailsProps) {
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  if (!job) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <strong>Job ID:</strong> {job.id}
            </div>
            <div>
              <strong>Pickup Location:</strong> {job.pickup_location?.address}
            </div>
            <div>
              <strong>Delivery Location:</strong> {job.delivery_location?.address || 'N/A'}
            </div>
            <div>
              <strong>Status:</strong> {job.status}
            </div>
            <div>
              <strong>Description:</strong> {job.description || 'N/A'}
            </div>
            
            {job.status === 'completed' && job.assigned_to && (
              <div className="flex justify-end">
                <Button onClick={() => setIsRatingOpen(true)}>
                  Rate Transporter
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {job.assigned_to && (
        <TransporterRating
          jobId={job.id}
          transporterId={job.assigned_to}
          organizationId={job.organization_id}
          open={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
        />
      )}
    </>
  );
}
