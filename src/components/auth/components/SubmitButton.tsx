
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white transition-colors rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Signing in...</span>
        </div>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}
