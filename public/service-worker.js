
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
  const cache = await caches.open(API_CACHE);
  await cache.put(request, response.clone());
  return response;
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

// Fetch event - handle offline functionality
self.addEventListener('fetch', (event) => {
  // Only handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request.clone())
        .then(response => storeApiResponse(event.request, response))
        .catch(async () => {
          // Check if it's a POST/PUT/DELETE request
          if (['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
            return handleOfflineSubmission(event.request);
          }
          
          // For GET requests, try to return cached response
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cached response, return offline error
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
    // For non-API requests, use standard cache-first strategy
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

// Function to sync offline data
async function syncOfflineData() {
  const db = await openDB();
  const tx = db.transaction('offlineQueue', 'readwrite');
  const store = tx.objectStore('offlineQueue');
  const requests = await store.getAll();

  for (const request of requests) {
    try {
      await fetch(request.url, {
        method: request.method,
        body: request.body,
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Remove synced request from queue
      await store.delete(request.timestamp);
    } catch (error) {
      console.error('Sync failed for request:', error);
    }
  }
}
