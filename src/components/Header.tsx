import React, { useState, useEffect } from "react";
import InstallButton from "./Installbutton";

// Define a type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

const Header: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const checkIfAppInstalled = () => {
      setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );
    checkIfAppInstalled();
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", () => setIsInstalled(true));
    };
  }, []);

  if (isInstalled) {
    return null; // Hide the header after installation
  }

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Webank</h1>
      <InstallButton deferredPrompt={deferredPrompt} />
    </header>
  );
};

export default Header;
