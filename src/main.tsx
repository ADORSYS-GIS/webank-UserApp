import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/Store";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Check /sw.js response before registration
      const response = await fetch("/sw.js", { cache: "no-store" });
      const contentType = response.headers.get("Content-Type") ?? "";
      console.log("Pre-check /sw.js:", response.status, contentType);

      if (!response.ok) {
        throw new Error(`Failed to fetch /sw.js: ${response.status}`);
      }
      if (!contentType.includes("javascript")) {
        const text = await response.text();
        console.log("Content of /sw.js:", text.substring(0, 200));
        throw new Error(`Invalid Content-Type for /sw.js: ${contentType}`);
      }

      // Register with cache busting
      const swUrl = `/sw.js?_=${new Date().getTime()}`;
      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: "/",
      });
      console.log("Service Worker registered successfully:", registration);

      // Force update
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        }
      });

      // Log controller
      if (navigator.serviceWorker.controller) {
        console.log(
          "Service Worker controller active:",
          navigator.serviceWorker.controller,
        );
      } else {
        console.log("No active Service Worker controller");
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      // Log /sw.js response
      try {
        const response = await fetch("/sw.js", { cache: "no-store" });
        console.log(
          "Response from /sw.js:",
          response.status,
          response.headers.get("Content-Type"),
        );
        const text = await response.text();
        console.log("Content of /sw.js:", text.substring(0, 200));
      } catch (fetchError) {
        console.error("Failed to fetch /sw.js:", fetchError);
      }
    }
  });
}
