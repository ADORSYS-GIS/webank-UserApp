import { useState, useEffect } from "react";
import {
  RequestToSendPowJWT,
  RequestToSendNonce,
} from "../services/keyManagement/requestService.ts";
import { performProofOfWork } from "../services/proofOfWork";
import { retrieveKeyPair } from "../services/keyManagement/storeKey.ts";

const useInitialization = () => {
  const [devCert, setDevCert] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performInitialization = async () => {
      try {
        console.log("Requesting initiation nonce...");

        // Request initiation nonce from backend
        const initiationNonce = await RequestToSendNonce();

        if (!initiationNonce) {
          throw new Error(
            "Failed to receive initiation nonce from the server.",
          );
        }
        console.log("Initiation nonce received:", initiationNonce);
        const { publicKey } = await retrieveKeyPair(1);
        // Step 3: Perform Proof of Work
        console.log("Starting Proof of Work...");
        const powDifficulty = 4;
        console.time();

        const result = await performProofOfWork(
          initiationNonce,
          publicKey,
          powDifficulty,
        );

        console.log("Proof of Work completed:", result);
        console.timeEnd();
        //

        const powNonceString = result.powNonce.toString();
        console.log("Pow Nonce:", powNonceString);
        const devCert = await RequestToSendPowJWT(
          initiationNonce,
          result.powHash,
          powNonceString,
        );

        console.log(devCert);
        setDevCert(devCert);
        return devCert;
      } catch (err) {
        console.error("Initialization failed:", err);
        setError((err as Error).message || "Unknown error occurred.");
      }
    };

    performInitialization();
  }, []);

  return { devCert, error };
};

export default useInitialization;
