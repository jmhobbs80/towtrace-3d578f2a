
import { Label } from "@/components/ui/label";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";

interface SignInFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignInFields({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit
}: SignInFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </Label>
        <EmailInput value={email} onChange={setEmail} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <PasswordInput value={password} onChange={setPassword} />
      </div>

      <SubmitButton loading={loading} />
    </form>
  );
}
