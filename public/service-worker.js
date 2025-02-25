
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url,
        jobId: data.jobId,
        type: data.type
      },
      actions: data.actions || [],
      tag: data.tag || 'default'
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }

  // Handle notification action clicks
  if (event.action === 'accept_job') {
    // Handle accept job action
    event.waitUntil(
      fetch('/api/jobs/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: event.notification.data.jobId
        })
      })
    );
  }
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // Sync logic for offline notifications
  const notifications = await self.registration.getNotifications();
  for (const notification of notifications) {
    if (notification.data?.needsSync) {
      // Sync notification status with server
      try {
        await fetch('/api/notifications/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: notification.data.id,
            status: 'delivered'
          })
        });
        notification.close();
      } catch (error) {
        console.error('Error syncing notification:', error);
      }
    }
  }
}
