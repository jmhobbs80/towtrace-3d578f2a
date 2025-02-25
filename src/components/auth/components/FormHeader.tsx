
import { Logo } from "@/components/branding/Logo";

export function FormHeader() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <Logo size="lg" className="w-auto" />
      <h1 className="text-2xl font-semibold text-foreground">
        Sign in to your account
      </h1>
    </div>
  );
}
