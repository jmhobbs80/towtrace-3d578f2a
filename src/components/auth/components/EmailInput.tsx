
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="relative">
      <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-primary" />
      <Input
        id="email"
        type="email"
        placeholder="name@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-11 text-base border-input focus:border-primary hover:border-primary rounded-xl bg-background shadow-sm"
        required
      />
    </div>
  );
}
