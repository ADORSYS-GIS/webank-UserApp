import React from "react";

interface InstallButtonProps {
  deferredPrompt: {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: string }>;
  } | null;
}

const InstallButton: React.FC<InstallButtonProps> = ({ deferredPrompt }) => {
  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();

      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the installation prompt");
          } else {
            console.log("User dismissed the installation prompt");
          }
        })
        .catch((err) =>
          console.log("Error handling installation prompt", err),
        );
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      Install Webank
    </button>
  );
};

export default InstallButton;