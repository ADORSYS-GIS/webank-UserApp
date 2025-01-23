import { useEffect } from "react";
import { RequestToSendNonce } from "../services/keyManagement/requestService.ts";

const useInitialization = () => {
  useEffect(() => {
    const performInitialization = async () => {
      try {
        const result = await RequestToSendNonce();
        console.log("Initialization successful:", result);
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };
    performInitialization();
  }, []);
};

export default useInitialization;
