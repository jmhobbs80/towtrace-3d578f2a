
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { LocationUpdate, LocationQueue } from '@/components/location/types';

const QUEUE_KEY = 'location_queue';
const MAX_QUEUE_SIZE = 100;
const MAX_QUEUE_AGE = 24 * 60 * 60 * 1000; // 24 hours

interface QueueStatus {
  pendingItems: number;
  lastSyncAttempt: number | null;
}

// Extend ServiceWorkerRegistration type to include sync
declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

export const useOfflineQueue = () => {
  const [queuedUpdates, setQueuedUpdates] = useState<LocationUpdate[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({
    pendingItems: 0,
    lastSyncAttempt: null
  });
  const { toast } = useToast();

  const addToQueue = useCallback((update: LocationUpdate) => {
    setQueuedUpdates(prev => {
      const filtered = prev.filter(
        item => Date.now() - item.timestamp < MAX_QUEUE_AGE
      );
      return [...filtered.slice(-MAX_QUEUE_SIZE), update];
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueuedUpdates([]);
    localStorage.removeItem(QUEUE_KEY);
    setQueueStatus(prev => ({ ...prev, pendingItems: 0 }));
  }, []);

  // Handle service worker messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OFFLINE_DATA_STATUS') {
        setQueueStatus(prev => ({
          ...prev,
          pendingItems: event.data.pendingItems
        }));
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, []);

  // Load queued updates from localStorage
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_KEY);
      if (savedQueue) {
        const parsed: LocationQueue = JSON.parse(savedQueue);
        const validUpdates = parsed.updates.filter(
          update => Date.now() - update.timestamp < MAX_QUEUE_AGE
        );
        setQueuedUpdates(validUpdates);
        setQueueStatus(prev => ({ ...prev, pendingItems: validUpdates.length }));
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
          updates: queuedUpdates,
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
      // Request sync when coming back online, with type checking
      navigator.serviceWorker?.ready.then(registration => {
        if (registration.sync) {
          registration.sync.register('sync-updates').catch(console.error);
        }
      });
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

    // Check for pending offline data periodically
    const checkInterval = setInterval(() => {
      navigator.serviceWorker?.controller?.postMessage('CHECK_OFFLINE_DATA');
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(checkInterval);
    };
  }, [toast]);

  return {
    queuedUpdates,
    isOnline,
    queueStatus,
    addToQueue,
    clearQueue
  };
};
