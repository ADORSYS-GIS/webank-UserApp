// src/hooks/useAppInstalled.ts
import { useEffect } from "react";
import generateKeyPair from "../services/keyManagement/generateKey";

const useAppInstalled = () => {
  useEffect(() => {
    const handleAppInstalled = async () => {
      console.log("App installed successfully. Generating key pair...");

      // Generate RSA key pair
      await generateKeyPair();
      console.log("Key pair generated successfully.");
    };

    // Listen for the appinstalled event
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);
};

export default useAppInstalled;
