
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PasswordInput({ value, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#7E69AB]" />
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-11 text-base border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5] rounded-lg shadow-sm animate-scale"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 text-[#7E69AB] hover:text-[#9b87f5] focus:outline-none transition-colors duration-200"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
