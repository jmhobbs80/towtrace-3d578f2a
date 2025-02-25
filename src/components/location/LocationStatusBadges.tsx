
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

const formatSpeed = (speed: number): string => {
  const kmh = speed * 3.6;
  return `${Math.round(kmh).toLocaleString()} km/h`;
};

const formatAccuracy = (accuracy: number): string => {
  return `±${Math.round(accuracy).toLocaleString()}m`;
};

const formatLastUpdate = (date: Date): string => {
  try {
    return date.toLocaleTimeString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid time";
  }
};

export const LocationStatusBadges = ({
  isOnline,
  lastUpdate,
  accuracy,
  speed,
  eta,
  queuedUpdates
}: LocationStatusBadgesProps) => {
  return (
    <div className="flex flex-col gap-2" data-testid="location-status-badges">
      <Badge variant="outline" className="w-fit">
        {isOnline ? (
          <Wifi className="mr-2 h-4 w-4" aria-hidden="true" />
        ) : (
          <WifiOff className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        <span>{isOnline ? "Online" : "Offline Mode"}</span>
      </Badge>
      
      {lastUpdate instanceof Date && (
        <Badge variant="outline" className="w-fit">
          <Timer className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Last Update: {formatLastUpdate(lastUpdate)}</span>
        </Badge>
      )}
      
      {typeof accuracy === 'number' && !isNaN(accuracy) && (
        <Badge variant="outline" className="w-fit">
          <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Accuracy: {formatAccuracy(accuracy)}</span>
        </Badge>
      )}

      {typeof speed === 'number' && !isNaN(speed) && speed > 0 && (
        <Badge variant="outline" className="w-fit">
          <span>Speed: {formatSpeed(speed)}</span>
        </Badge>
      )}

      {typeof eta === 'number' && !isNaN(eta) && eta >= 0 && (
        <Badge variant="secondary" className="w-fit">
          <span>ETA: {eta.toLocaleString()} minutes</span>
        </Badge>
      )}
      
      {typeof queuedUpdates === 'number' && queuedUpdates > 0 && (
        <Badge variant="secondary" className="w-fit">
          <span>Pending Updates: {queuedUpdates.toLocaleString()}</span>
        </Badge>
      )}
    </div>
  );
};
