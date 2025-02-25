
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const LoadingScreen = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Loader2 
          className={`animate-spin text-primary ${
            isMobile ? 'w-8 h-8' : 'w-12 h-12'
          }`} 
        />
        <p className={`text-muted-foreground ${
          isMobile ? 'text-sm' : 'text-base'
        }`}>
          Loading...
        </p>
      </div>
    </div>
  );
};
