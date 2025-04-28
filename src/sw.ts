/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// Database configuration
const DB_NAME = "webank-db";
const STORE_NAME = "shared-content";
const DB_VERSION = 1;

// Enhanced database handling
const openDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    console.log("[SW] Opening database connection");
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("[SW] Database error:", (event.target as IDBRequest).error);
      reject(new Error("Database error"));
    };

    request.onsuccess = (event) => {
      console.log("[SW] Database opened successfully");
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      console.log("[SW] Database upgrade needed");
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Skipping waiting");
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");
  event.waitUntil(Promise.all([self.clients.claim(), cleanupOutdatedCaches()]));
});

precacheAndRoute(self.__WB_MANIFEST);

let allowlist;
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }),
);

registerRoute(
  ({ url }) => {
    const isShareHandler = url.pathname === "/share-handler";
    console.log(
      `[SW] Intercepted request: ${url.href}, isShareHandler: ${isShareHandler}`,
    );
    return isShareHandler;
  },
  async ({ request }) => {
    console.log("[SW] Handling POST /share-handler");
    try {
      const formData = await request.formData();
      const title = formData.get("title") || "";
      const text = formData.get("text") || "";
      const url = formData.get("url") || "";
      const files = formData.getAll("files") as File[];

      console.log("[SW] Form data:", {
        title,
        text,
        url,
        fileCount: files.length,
        files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      });

      if (!files.length) {
        console.error("[SW] No files received");
        return new Response("No files shared", { status: 400 });
      }

      // Check file size limit (100KB)
      const MAX_FILE_SIZE = 100 * 1024; // 100KB in bytes
      const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        console.error("[SW] File size exceeds limit:", oversizedFiles.map(f => f.name));
        return new Response(`File size exceeds 100KB limit: ${oversizedFiles.map(f => f.name).join(', ')}`, { status: 400 });
      }

      const fileData = await Promise.all(
        files.map(async (file) => {
          console.log(
            `[SW] Processing file: ${file.name} (${file.type}, ${file.size} bytes)`,
          );
          try {
            const base64 = await blobToBase64(file);
            return {
              name: file.name,
              type: file.type,
              size: file.size,
              base64,
            };
          } catch (error) {
            console.error(`[SW] Failed to process file ${file.name}:`, error);
            throw new Error(`Failed to process file ${file.name}`);
          }
        }),
      );

      const sharedContent = { title, text, url, files: fileData };
      const jsonSize = JSON.stringify(sharedContent).length;
      console.log("[SW] Shared content size:", jsonSize);

      if (jsonSize > 10 * 1024 * 1024) {
        console.error("[SW] Content too large for IndexedDB:", jsonSize);
        return new Response("File too large (max 10MB)", { status: 400 });
      }

      // Store in IndexedDB
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      console.log("[SW] Storing data in IndexedDB");
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ id: "sharedContent", ...sharedContent });
        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(new Error("Failed to store shared content"));
      });
      console.log("[SW] Data stored successfully");

      // Notify clients
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      console.log("[SW] Found clients:", clients.length);
      if (clients.length === 0) {
        console.warn("[SW] No clients found, opening new window");
        const newWindow = await self.clients.openWindow("/share-handler");
        console.log(
          "[SW] New window opened:",
          newWindow ? "Success" : "Failed",
        );
      } else {
        for (const client of clients) {
          console.log("[SW] Sending RELOAD_CONTENT to client:", client.id);
          client.postMessage({
            type: "RELOAD_CONTENT",
            data: sharedContent,
          });
        }
      }

      console.log("[SW] Redirecting to /share-handler");
      return Response.redirect("/share-handler", 303);
    } catch (error) {
      console.error("[SW] Error handling share:", error);
      return new Response(`Error processing share: `, { status: 500 });
    }
  },
  "POST",
);

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("[SW] File conversion completed");
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      console.error("[SW] File conversion failed");
      reject(new Error("Failed to read file as base64"));
    };
    reader.readAsDataURL(blob);
  });
}
