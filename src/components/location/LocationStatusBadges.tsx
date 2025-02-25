
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Navigation, Timer } from "lucide-react";

interface LocationStatusBadgesProps {
  isOnline: boolean;
  lastUpdate: Date | null;
  accuracy: number | null;
  speed: number | null;
  eta: number | null;
  queuedUpdates: number;
}

export const LocationStatusBadges = ({
  isOnline,
  lastUpdate,
  accuracy,
  speed,
  eta,
  queuedUpdates
}: LocationStatusBadgesProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Badge variant="outline" className="w-fit">
        {isOnline ? (
          <Wifi className="mr-2 h-4 w-4" />
        ) : (
          <WifiOff className="mr-2 h-4 w-4" />
        )}
        {isOnline ? "Online" : "Offline Mode"}
      </Badge>
      
      {lastUpdate && (
        <Badge variant="outline" className="w-fit">
          <Timer className="mr-2 h-4 w-4" />
          Last Update: {lastUpdate.toLocaleTimeString()}
        </Badge>
      )}
      
      {accuracy && (
        <Badge variant="outline" className="w-fit">
          <Navigation className="mr-2 h-4 w-4" />
          Accuracy: ±{Math.round(accuracy)}m
        </Badge>
      )}

      {speed !== null && (
        <Badge variant="outline" className="w-fit">
          Speed: {Math.round(speed * 3.6)} km/h
        </Badge>
      )}

      {eta !== null && (
        <Badge variant="secondary" className="w-fit">
          ETA: {eta} minutes
        </Badge>
      )}
      
      {queuedUpdates > 0 && (
        <Badge variant="secondary" className="w-fit">
          Pending Updates: {queuedUpdates}
        </Badge>
      )}
    </div>
  );
};
