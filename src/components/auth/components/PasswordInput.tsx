
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
      <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-primary" />
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-11 text-base border-input focus:border-primary hover:border-primary rounded-xl bg-background shadow-sm"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 text-primary hover:text-primary/80 focus:outline-none transition-colors duration-200"
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
