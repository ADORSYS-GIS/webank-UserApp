/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import firebaseConfig from "./services/notifications/firebaseConfig";

declare let self: ServiceWorkerGlobalScope;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background push notifications
onBackgroundMessage(messaging, (payload) => {
  console.log("Received background notification:", payload);

  const { title = "Notification", body = "You have a new message", icon = "/android-chrome-192x192.png" } = payload.notification || {};

  self.registration.showNotification(title, {
    body,
    icon,
    badge: "/android-chrome-192x192.png",
  });
});

// Listen for 'message' events (for service worker updates)
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// Default precaching and offline support
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist: import.meta.env.DEV ? [/^\/$/] : undefined }));
