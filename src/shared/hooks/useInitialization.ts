import { useState, useEffect } from "react";
import {
  useDeviceRegistrationServicePostApiPrsDevInit,
  useDeviceRegistrationServicePostApiPrsDevValidate,
} from "@openapi/generated/prs/queries/queries";
import { performProofOfWork } from "@services/computation/proofOfWork.ts";
import { retrieveKeyPair } from "@services/keyManagement/storeKey.ts";

const useInitialization = () => {
  const [devCert, setDevCert] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use TanStack Query mutations for device registration
  const devInitMutation = useDeviceRegistrationServicePostApiPrsDevInit();
  const devValidateMutation =
    useDeviceRegistrationServicePostApiPrsDevValidate();

  useEffect(() => {
    let cancelled = false;
    const performInitialization = async () => {
      try {
        // Step 1: Request initiation nonce from backend
        const date = new Date();
        const timeStamp = date.toISOString();
        const initRes = await devInitMutation.mutateAsync({
          requestBody: { timeStamp },
        });
        console.log("Requesting initiation nonce from backend", initRes);
        const initiationNonce = initRes?.nonce;
        if (!initiationNonce) {
          throw new Error(
            "Failed to receive initiation nonce from the server.",
          );
        }
        const { publicKey } = await retrieveKeyPair(1);
        // Step 2: Perform Proof of Work
        const powDifficulty = 4;
        const result = await performProofOfWork(
          initiationNonce,
          publicKey,
          powDifficulty,
        );
        const powNonceString = result.powNonce.toString();
        // Step 3: Validate device (get devCert)
        const validateRes = await devValidateMutation.mutateAsync({
          requestBody: {
            initiationNonce,
            powHash: result.powHash,
            powNonce: powNonceString,
          },
        });
        console.log("Validating device with nonce", validateRes);
        const devCert = validateRes?.certificate;
        if (!devCert) {
          throw new Error(
            "Failed to receive device certificate from the server.",
          );
        }
        // Write devCert to localStorage immediately after validation
        localStorage.setItem("devCert", devCert);
        if (!cancelled) setDevCert(devCert);
      } catch (err) {
        if (!cancelled)
          setError((err as Error).message || "Unknown error occurred.");
      }
    };
    performInitialization();
    return () => {
      cancelled = true;
    };
  }, [] ) ; 

  return { devCert, error };
};

export default useInitialization;
