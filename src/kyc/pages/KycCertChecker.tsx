import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/Store"; // Ensure this is the correct path
import { setStatus, setKycCert } from "../../slices/accountSlice"; // Updated Redux actions
import { RequestToGetCert } from "../../services/keyManagement/requestService";

const KycCertChecker = () => {
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.account.status);
  const accountCert = useSelector((state: RootState) => state.account.accountCert);

  useEffect(() => {
    // If status is null, approved, or rejected, stop execution
    if (status === null || status === "APPROVED" || status === "REJECTED") {
      console.log("[KycCertChecker] Status is null, APPROVED, or REJECTED. Stopping execution.");
      return;
    }

    console.log("[KycCertChecker] Status is PENDING, starting certificate polling...");

    const interval = setInterval(async () => {
      console.log("[KycCertChecker] Sending request to get certificate...");

      try {
        const response = await RequestToGetCert(accountCert);
        console.log("[KycCertChecker] Response received:", response);

        if (response && typeof response === "string") {
          if (response.includes("certificate")) {
            // Extract the certificate by trimming the response
            const certificate = response.split("certificate").pop()?.trim();

            if (certificate) {
              console.log("[KycCertChecker] Certificate found. Updating Redux state...");
              dispatch(setKycCert(certificate)); // Store the certificate in Redux
              dispatch(setStatus("APPROVED")); // Change status to APPROVED
              clearInterval(interval); // Stop making requests
              console.log("[KycCertChecker] Polling stopped as certificate is received.");
            }
          } else if (response === "null") {
            console.log("[KycCertChecker] Response is null. Continuing polling...");
          }
        }
      } catch (error) {
        console.error("[KycCertChecker] Error fetching certificate:", error);
      }
    }, 30 * 1000); // Runs every 30 seconds

    return () => {
      console.log("[KycCertChecker] Cleaning up interval on component unmount.");
      clearInterval(interval);
    };
  }, [status, accountCert, dispatch]);

  return null; // No UI needed, just background processing
};

export default KycCertChecker;
