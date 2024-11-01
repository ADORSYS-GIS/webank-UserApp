// src/components/InstallButton.tsx
import React from "react";

interface InstallButtonProps {
  deferredPrompt: Event | null;
}

const InstallButton: React.FC<InstallButtonProps> = ({ deferredPrompt }) => {
  const handleInstallClick = () => {
    if (deferredPrompt) {
      // @ts-expect-error error
      deferredPrompt.prompt(); // Show the install prompt
      // @ts-expect-error error
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
      });
    }
  };

  return (
    <div>
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Install App
        </button>
      )}
    </div>
  );
};

export default InstallButton;
