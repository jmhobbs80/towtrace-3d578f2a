
import Image from "@/components/ui/image";

export function FormHeader() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <Image
        src="/towtrace-logo.png"
        alt="TowTrace"
        width={200}
        height={48}
        priority
        className="w-auto h-12"
      />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome to TowTrace
      </h1>
    </div>
  );
}
