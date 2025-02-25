
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  strength: number;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({ strength, showRequirements = true }: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-2">
      <Progress 
        value={strength} 
        className="h-1.5 bg-[#E5DEFF]"
        style={{
          '--progress-background': strength < 40 ? '#ff453a' :
                                 strength < 80 ? '#ff9f0a' : '#30D158'
        } as React.CSSProperties}
      />
      {showRequirements && (
        <p className="text-xs text-[#7E69AB]">
          Password must be at least 8 characters long and contain numbers, symbols, and both upper and lowercase letters
        </p>
      )}
    </div>
  );
}
