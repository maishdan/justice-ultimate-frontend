self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('jua-cache').then(cache => cache.addAll([
      '/',
      '/logo.png'
    ]))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Listen for push events
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'New Message Received';
  const options = {
    body: data.body || 'You have a new message in your admin inbox.',
    icon: '/logo.png',
    badge: '/logo.png',
    data: data.url || '/',
    actions: [
      { action: 'view', title: 'View Inbox' },
      { action: 'reply', title: 'Quick Reply' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  let url = event.notification.data || '/';
  if (event.action === 'reply') {
    // Optionally open reply UI
    url = '/dashboard/inbox';
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
}); 