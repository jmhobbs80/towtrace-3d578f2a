
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Signal, Timer, Wifi, Navigation, Clock } from "lucide-react";
import { useLocationTracking } from "./useLocationTracking";
import type { LocationTrackerProps } from "./types";

export const LocationTracker = ({ 
  jobId, 
  enabled = true, 
  updateInterval = 30000,
  onLocationUpdate 
}: LocationTrackerProps) => {
  const {
    isTracking,
    lastUpdate,
    accuracy,
    speed,
    eta,
    isOnline,
    queuedUpdates,
    startTracking,
    stopTracking
  } = useLocationTracking(jobId, updateInterval, onLocationUpdate);

  if (!enabled) return null;

  return (
    <div className="space-y-4 w-full animate-fade-in">
      <Button
        variant={isTracking ? "destructive" : "default"}
        onClick={isTracking ? stopTracking : startTracking}
        className="w-full h-12 text-base font-medium rounded-xl transition-all duration-300 hover:scale-[1.02]"
      >
        {isTracking ? "Stop Location Tracking" : "Start Location Tracking"}
      </Button>
      
      {isTracking && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Badge 
            variant={isOnline ? "default" : "secondary"}
            className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl"
          >
            <Wifi className="w-4 h-4" />
            {isOnline ? "Online" : "Offline"}
          </Badge>

          {lastUpdate && (
            <Badge 
              variant="outline" 
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl"
            >
              <Clock className="w-4 h-4" />
              {new Date(lastUpdate).toLocaleTimeString()}
            </Badge>
          )}

          {accuracy && (
            <Badge 
              variant="outline"
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl"
            >
              <Signal className="w-4 h-4" />
              {`±${Math.round(accuracy)}m`}
            </Badge>
          )}

          {speed && (
            <Badge 
              variant="outline"
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl"
            >
              <Timer className="w-4 h-4" />
              {`${Math.round(speed * 3.6)} km/h`}
            </Badge>
          )}

          {eta && (
            <Badge 
              variant="outline"
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl"
            >
              <Navigation className="w-4 h-4" />
              {`ETA: ${eta} min`}
            </Badge>
          )}

          {queuedUpdates.length > 0 && (
            <Badge 
              variant="secondary"
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl"
            >
              {`${queuedUpdates.length} updates pending`}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
