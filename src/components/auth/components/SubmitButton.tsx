
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-12 text-base font-medium bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed animate-scale"
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
