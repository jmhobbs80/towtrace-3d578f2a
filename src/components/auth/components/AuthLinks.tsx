
import { Link } from "react-router-dom";
import { PasswordResetDialog } from "../PasswordResetDialog";

interface AuthLinksProps {
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resetEmail: string;
  onResetEmailChange: (email: string) => void;
  resetStep: number;
  isResetting: boolean;
  onResetSubmit: (e: React.FormEvent) => void;
}

export function AuthLinks({
  isDialogOpen,
  onOpenChange,
  resetEmail,
  onResetEmailChange,
  resetStep,
  isResetting,
  onResetSubmit
}: AuthLinksProps) {
  return (
    <div className="flex flex-col items-center space-y-6 pt-4">
      <PasswordResetDialog
        isOpen={isDialogOpen}
        onOpenChange={onOpenChange}
        resetEmail={resetEmail}
        onResetEmailChange={onResetEmailChange}
        resetStep={resetStep}
        isResetting={isResetting}
        onSubmit={onResetSubmit}
      />
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
      >
        Forgot your password?
      </button>
      <div className="w-full text-center">
        <Link 
          to="/auth/signup" 
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Sign up now
        </Link>
      </div>
    </div>
  );
}
