
import { Button } from "@/components/ui/button";
import { LocationStatusBadges } from "./LocationStatusBadges";
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
    <div className="space-y-2">
      <Button
        variant={isTracking ? "destructive" : "default"}
        onClick={isTracking ? stopTracking : startTracking}
        className="w-full"
      >
        {isTracking ? "Stop Location Tracking" : "Start Location Tracking"}
      </Button>
      
      {isTracking && (
        <LocationStatusBadges
          isOnline={isOnline}
          lastUpdate={lastUpdate}
          accuracy={accuracy}
          speed={speed}
          eta={eta}
          queuedUpdates={queuedUpdates.length}
        />
      )}
    </div>
  );
};
