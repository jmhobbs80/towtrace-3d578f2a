
import Image from "@/components/ui/image";

export function FormHeader() {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <Image
        src="/towtrace-logo.png"
        alt="TowTrace"
        width={200}
        height={48}
        className="w-auto h-12 transition-opacity hover:opacity-90"
      />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome to TowTrace
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Access your account to manage your fleet and towing operations
      </p>
    </div>
  );
}
