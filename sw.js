// PLAKAM web: telefon bildirimlerini göstermek için küçük service worker.
// Android Chrome ve iOS (ana ekrana eklenmiş uygulama) bildirimleri yalnızca
// service worker üzerinden gösterebilir.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Bildirime dokununca açık uygulama sekmesini öne getir, yoksa yenisini aç
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const scope = self.registration.scope;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(scope) && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(scope);
    })
  );
});
