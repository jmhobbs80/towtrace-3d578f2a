
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { LocationUpdate, LocationQueue } from '@/components/location/types';

const QUEUE_KEY = 'location_queue';
const MAX_QUEUE_SIZE = 100;

export const useOfflineQueue = () => {
  const [queuedUpdates, setQueuedUpdates] = useState<LocationUpdate[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  const addToQueue = useCallback((update: LocationUpdate) => {
    setQueuedUpdates(prev => [...prev.slice(-MAX_QUEUE_SIZE), update]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueuedUpdates([]);
    localStorage.removeItem(QUEUE_KEY);
  }, []);

  // Load queued updates from localStorage
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_KEY);
      if (savedQueue) {
        const parsed: LocationQueue = JSON.parse(savedQueue);
        const validUpdates = parsed.updates.filter(
          update => Date.now() - update.timestamp < 24 * 60 * 60 * 1000
        );
        setQueuedUpdates(validUpdates);
      }
    } catch (error) {
      console.error('Error loading queued updates:', error);
    }
  }, []);

  // Save queued updates to localStorage
  useEffect(() => {
    if (queuedUpdates.length > 0) {
      try {
        const queue: LocationQueue = {
          updates: queuedUpdates.slice(-MAX_QUEUE_SIZE),
          lastSync: Date.now()
        };
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      } catch (error) {
        console.error('Error saving queued updates:', error);
      }
    }
  }, [queuedUpdates]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing updates...",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Updates will be queued until connection is restored",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return {
    queuedUpdates,
    isOnline,
    addToQueue,
    clearQueue
  };
};
