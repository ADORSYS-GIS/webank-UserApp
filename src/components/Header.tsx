// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import InstallButton from "./Installbutton";

const Header: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Save the event for triggering later
      setDeferredPrompt(event);
    };

    const checkIfAppInstalled = () => {
      // Check if the app is already installed (PWA)
      setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the app is installed
    checkIfAppInstalled();

    // Listen for when the app is launched in standalone mode
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", () => setIsInstalled(true));
    };
  }, []);

  if (isInstalled) {
    return null; // Return null to hide the header after installation
  }

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Webank</h1>
      <InstallButton deferredPrompt={deferredPrompt} />
    </header>
  );
};

export default Header;
