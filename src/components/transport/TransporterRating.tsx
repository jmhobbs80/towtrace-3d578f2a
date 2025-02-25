
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Textarea } from "@/components/ui/textarea";

interface TransporterRatingProps {
  jobId: string;
  transporterId: string;
  organizationId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransporterRating({
  jobId,
  transporterId,
  organizationId,
  open,
  onClose,
  onSuccess,
}: TransporterRatingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const submitRating = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("transporter_ratings").insert({
        job_id: jobId,
        transporter_id: transporterId,
        organization_id: organizationId,
        rating: rating.toString() as "1" | "2" | "3" | "4" | "5",
        comment,
        created_by: user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
      });
      onSuccess?.();
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Transporter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => submitRating.mutate()}
              disabled={rating === 0 || submitRating.isPending}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
