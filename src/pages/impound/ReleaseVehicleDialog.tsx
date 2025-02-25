
import * as React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface ReleaseVehicleForm {
  release_notes?: string;
  authorized_by: string;
}

interface ReleaseVehicleDialogProps {
  impoundId: string;
  onRelease?: () => void;
}

export function ReleaseVehicleDialog({ impoundId, onRelease }: ReleaseVehicleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { organization, user } = useAuth();
  const { toast } = useToast();
  const form = useForm<ReleaseVehicleForm>();

  const onSubmit = async (data: ReleaseVehicleForm) => {
    if (!organization?.id || !user?.id) return;

    try {
      // Update the impounded vehicle status
      const { error: impoundError } = await supabase
        .from('impounded_vehicles')
        .update({
          status: 'pending_release',
          release_authorization_by: user.id,
          release_authorization_date: new Date().toISOString(),
          metadata: {
            ...data,
            authorized_by_name: data.authorized_by
          }
        })
        .eq('id', impoundId);

      if (impoundError) throw impoundError;

      toast({
        title: "Success",
        description: "Vehicle has been authorized for release.",
      });

      setOpen(false);
      form.reset();
      onRelease?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authorize vehicle release. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Authorize Release</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authorize Vehicle Release</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorized_by">Authorized By</Label>
            <Input
              id="authorized_by"
              {...form.register("authorized_by", { required: true })}
              placeholder="Full name of authorizing person"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="release_notes">Release Notes</Label>
            <Textarea
              id="release_notes"
              {...form.register("release_notes")}
              placeholder="Any additional notes about the release"
            />
          </div>

          <Button type="submit" className="w-full">Authorize Release</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
