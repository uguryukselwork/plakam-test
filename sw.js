// PLAKAM web: telefon bildirimlerini göstermek için küçük service worker.
// Android Chrome ve iOS (ana ekrana eklenmiş uygulama) bildirimleri yalnızca
// service worker üzerinden gösterebilir.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Bildirime dokununca açık uygulama sekmesini öne getir, yoksa yenisini aç
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const scope = self.registration.scope;
  const notificationId = event.notification.data && event.notification.data.notificationId;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(scope) && "focus" in client) {
          // Açık uygulamaya hangi bildirime dokunulduğunu söyle; ilgili ekranı o açar
          if (notificationId) client.postMessage({ type: "plakam-open-notification", notificationId });
          return client.focus();
        }
      }
      return self.clients.openWindow(
        notificationId ? scope + "?openNotification=" + encodeURIComponent(notificationId) : scope
      );
    })
  );
});
