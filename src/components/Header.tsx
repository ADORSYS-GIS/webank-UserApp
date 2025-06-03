import React, { useState, useEffect } from "react";
import InstallButton from "./Installbutton";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}
const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
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
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsVisible(false);
    });
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", () => setIsInstalled(true));
    };
  }, []);
  const handleDismiss = () => {
    setIsVisible(false);
  };
  return (
    <AnimatePresence>
      {isVisible && !isInstalled && (
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
              <div className="flex items-center gap-3 pl-4 pr-2 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    Install App
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get faster access
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <InstallButton deferredPrompt={deferredPrompt} />
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Dismiss"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default InstallPrompt;
