import { useState, useEffect } from "react";
import { RequestToSendNonce } from "../services/keyManagement/requestService.ts";
import { performProofOfWork } from "../services/proofOfWork"; // Import PoW function

const useInitialization = () => {
  const [powResult, setPowResult] = useState<{ powHash: string; powNonce: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performInitialization = async () => {
      try {
        console.log("Requesting initiation nonce...");
        // Step 1: Request initiation nonce from backend
        const initiationNonce = await RequestToSendNonce();

        if (!initiationNonce) {
          throw new Error("Failed to receive initiation nonce from the server.");
        }

        console.log("Initiation nonce received:", initiationNonce);

        // Step 2: Define your device's public key (replace with actual implementation)
        const devicePub = "YOUR_DEVICE_PUBLIC_KEY";

        // Step 3: Perform Proof of Work
        console.log("Starting Proof of Work...");
        const powDifficulty = 6; // Adjust difficulty as required
        console.time()
        const result = await performProofOfWork(initiationNonce, devicePub, powDifficulty);

        console.log("Proof of Work completed:", result);
        console.timeEnd()
        setPowResult(result);
      } catch (err) {
        console.error("Initialization failed:", err);
        setError((err as Error).message || "Unknown error occurred.");
      }
    };

    performInitialization();
  }, []);

  return { powResult, error };
};

export default useInitialization;
