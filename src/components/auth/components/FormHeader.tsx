
import Image from "@/components/ui/image";

export function FormHeader() {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="relative w-48 h-12">
        <Image
          src="/towtrace-logo.png"
          alt="TowTrace"
          width={200}
          height={48}
          className="w-full h-full object-contain transition-opacity hover:opacity-90"
          priority
        />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to TowTrace
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Access your account to manage your fleet and towing operations
        </p>
      </div>
    </div>
  );
}
