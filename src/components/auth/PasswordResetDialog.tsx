
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface PasswordResetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resetEmail: string;
  onResetEmailChange: (email: string) => void;
  resetStep: number;
  isResetting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordResetDialog({
  isOpen,
  onOpenChange,
  resetEmail,
  onResetEmailChange,
  resetStep,
  isResetting,
  onSubmit
}: PasswordResetDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md w-[95vw] mx-auto rounded-xl border-[#E5DEFF] p-6 bg-white shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#1A1F2C] text-xl">Reset Password</AlertDialogTitle>
          <AlertDialogDescription className="text-[#7E69AB]">
            {resetStep === 1 && "Enter your email address to receive a password reset link."}
            {resetStep === 2 && "Sending reset instructions..."}
            {resetStep === 3 && "Reset link has been sent!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mb-4">
          <Progress 
            value={resetStep * 33.33} 
            className="h-1.5 bg-[#E5DEFF]"
            style={{
              '--progress-background': '#9b87f5'
            } as React.CSSProperties}
          />
          <p className="text-xs text-[#7E69AB] mt-2 text-center">
            Step {resetStep} of 3
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {resetStep === 1 && (
            <div className="space-y-2">
              <Label htmlFor="resetEmail" className="text-[#1A1F2C]">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => onResetEmailChange(e.target.value)}
                placeholder="name@example.com"
                required
                className="h-11 border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5] rounded-lg shadow-sm"
              />
            </div>
          )}
          <AlertDialogFooter className="sm:flex-row flex-col gap-2">
            <AlertDialogCancel 
              type="button" 
              className="sm:mt-0 mt-2 border-[#E5DEFF] text-[#7E69AB] hover:bg-[#E5DEFF]/10"
            >
              Cancel
            </AlertDialogCancel>
            {resetStep === 1 && (
              <Button 
                type="submit" 
                disabled={isResetting} 
                className="sm:ml-2 w-full sm:w-auto bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors"
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </Button>
            )}
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
