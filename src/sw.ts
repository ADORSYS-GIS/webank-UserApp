/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Service Worker: Skipping waiting");
    self.skipWaiting();
  }
});

self.addEventListener("install", () => {
  console.log("Service Worker: Installing");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating");
  event.waitUntil(self.clients.claim());
});

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

let allowlist;
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }),
);

registerRoute(
  ({ url }) => {
    console.log("Service Worker: Intercepted request:", url.href);
    return url.pathname === "/share-handler";
  },
  async ({ request }) => {
    console.log("Service Worker: Handling POST /share-handler");
    try {
      const formData = await request.formData();
      const title = formData.get("title") || "";
      const text = formData.get("text") || "";
      const url = formData.get("url") || "";
      const files = formData.getAll("files") as File[];

      console.log("Service Worker: Form data:", {
        title,
        text,
        url,
        fileCount: files.length,
      });

      if (!files.length) {
        console.error("Service Worker: No files received");
        return new Response("No files shared", { status: 400 });
      }

      const fileData = await Promise.all(
        files.map(async (file) => {
          console.log(
            "Service Worker: Processing file:",
            file.name,
            file.type,
            file.size,
          );
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: await blobToBase64(file),
          };
        }),
      );

      const sharedContent = { title, text, url, files: fileData };
      const jsonSize = JSON.stringify(sharedContent).length;
      console.log("Service Worker: Shared content size:", jsonSize);

      if (jsonSize > 10 * 1024 * 1024) {
        console.error(
          "Service Worker: Content too large for IndexedDB:",
          jsonSize,
        );
        return new Response("File too large (max 10MB)", { status: 400 });
      }

      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      console.log("Service Worker: Found clients:", clients.length);
      if (clients.length === 0) {
        console.warn("Service Worker: No clients to send message to");
      }
      for (const client of clients) {
        console.log(
          "Service Worker: Sending STORE_SHARED_CONTENT to client:",
          client.id,
        );
        client.postMessage({
          type: "STORE_SHARED_CONTENT",
          data: sharedContent,
        });
      }

      console.log("Service Worker: Redirecting to /share-handler");
      return Response.redirect("/share-handler", 303);
    } catch (error) {
      console.error("Service Worker: Error handling share:", error);
      return new Response("Error processing share", { status: 500 });
    }
  },
  "POST",
);

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file as base64"));
    reader.readAsDataURL(blob);
  });
}
