
// Cache names
const CACHE_NAME = 'towtrace-v1';
const API_CACHE = 'towtrace-api-v1';

// Resources to cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_RESOURCES);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Helper function to store API responses
const storeApiResponse = async (request, response) => {
  if (!response.ok) return response;
  
  const cache = await caches.open(API_CACHE);
  await cache.put(request, response.clone());
  return response;
};

// Helper function for network-first strategy with timeout
const timeoutPromise = (promise, timeout) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    )
  ]);
};

// Helper function to handle offline submissions
const handleOfflineSubmission = async (request) => {
  try {
    // Store the request in IndexedDB for later sync
    const db = await openDB();
    await db.add('offlineQueue', {
      url: request.url,
      method: request.method,
      body: await request.clone().text(),
      headers: Array.from(request.headers.entries()),
      timestamp: Date.now(),
    });
    
    return new Response(JSON.stringify({ 
      status: 'queued',
      message: 'Request queued for background sync'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'Failed to queue request'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Fetch event - handle offline functionality
self.addEventListener('fetch', (event) => {
  // Only handle API requests specifically
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      timeoutPromise(
        fetch(event.request.clone())
          .then(response => storeApiResponse(event.request, response)),
        5000 // 5 second timeout
      )
      .catch(async (error) => {
        console.log('Network error:', error);
        
        // For GET requests, try to return cached response
        if (event.request.method === 'GET') {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
        }
        
        // For POST/PUT/DELETE requests, queue for later
        if (['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
          return handleOfflineSubmission(event.request);
        }
        
        // If no cached response and not a modifying request, return offline error
        return new Response(JSON.stringify({
          status: 'error',
          message: 'You are offline'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  } else {
    // For non-API requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Background sync
self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-updates') {
    event.waitUntil(syncOfflineData());
  }
});

// IndexedDB configuration
const DB_NAME = 'TowTraceOfflineDB';
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineQueue')) {
        db.createObjectStore('offlineQueue', { 
          keyPath: 'timestamp' 
        });
      }
    };
  });
};

// Function to sync offline data
async function syncOfflineData() {
  const db = await openDB();
  const tx = db.transaction('offlineQueue', 'readwrite');
  const store = tx.objectStore('offlineQueue');
  const requests = await store.getAll();

  for (const request of requests) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        body: request.body,
        headers: new Headers(request.headers)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Remove synced request from queue
      await store.delete(request.timestamp);
    } catch (error) {
      console.error('Sync failed for request:', error);
      // Leave failed request in queue for retry
      continue;
    }
  }
}

// Handle offline/online status changes
self.addEventListener('message', (event) => {
  if (event.data === 'CHECK_OFFLINE_DATA') {
    event.waitUntil(checkOfflineData());
  }
});

async function checkOfflineData() {
  const db = await openDB();
  const tx = db.transaction('offlineQueue', 'readonly');
  const store = tx.objectStore('offlineQueue');
  const count = await store.count();
  
  // Notify the client about pending offline data
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'OFFLINE_DATA_STATUS',
      pendingItems: count
    });
  });
}
