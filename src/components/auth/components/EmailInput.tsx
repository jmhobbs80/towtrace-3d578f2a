
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="relative">
      <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#7E69AB]" />
      <Input
        id="email"
        type="email"
        placeholder="name@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-11 text-base border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5] rounded-lg shadow-sm animate-scale"
        required
      />
    </div>
  );
}
