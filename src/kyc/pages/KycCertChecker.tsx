import { useEffect, useState } from "react";
import { RequestToGetCert } from "../../services/keyManagement/requestService";
import KycRejectionPopup from "../components/KycRejectionPopup";
import { useAccountStore } from "../../store/accountStore";

const KycCertChecker: React.FC = () => {
  const { setStatus, setKycCert, setDocumentStatus } = useAccountStore();
  const status = useAccountStore((state) => state.status);
  const documentStatus = useAccountStore((state) => state.documentStatus);
  const accountCert = useAccountStore((state) => state.accountCert);
  const accountId = useAccountStore((state) => state.accountId);
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    // If status is null or approved, stop execution
    if (status === null || status === "APPROVED") {
      console.log(
        "[KycCertChecker] Status is null or APPROVED. Stopping execution.",
      );
      return;
    }

    console.log(
      "[KycCertChecker] Status is PENDING, starting certificate polling...",
    );

    const interval = setInterval(
      async () => {
        console.log("[KycCertChecker] Sending request to get certificate...");

        try {
          if (!accountCert || !accountId) {
            console.log(
              "[KycCertChecker] Account authentication missing. Stopping polling.",
            );
            clearInterval(interval);
            return;
          } else
            console.log(
              "[KycCertChecker] Account authentication present. Fetching certificate...",
            );
          const response = await RequestToGetCert(accountId, accountCert);
          console.log("[KycCertChecker] Response received:", response);

          if (response && typeof response === "string") {
            if (response.includes("certificate")) {
              // Extract the certificate by trimming the response
              const certificate = response
                .replace("Your certificate is:", "")
                .trim();

              if (certificate) {
                console.log(
                  "[KycCertChecker] Certificate found. Updating Zustand state...",
                );
                setKycCert(certificate); // Store the certificate in Zustand
                setStatus("APPROVED"); // Change status to APPROVED
                setDocumentStatus("APPROVED"); // Change status to APPROVED
                clearInterval(interval); // Stop making requests
                console.log(
                  "[KycCertChecker] Polling stopped as certificate is received.",
                );
              }
            } else if (response.includes("REJECTED")) {
              console.log(
                "[KycCertChecker] Application rejected. Updating Zustand state...",
              );
              setStatus("REJECTED");
              setDocumentStatus("REJECTED");
              setRejectionReason(response.replace("REJECTED: ", ""));
              setShowRejectionPopup(true);
              clearInterval(interval);
              console.log(
                "[KycCertChecker] Polling stopped as application is rejected.",
              );
            }
          }
        } catch (error) {
          console.error("[KycCertChecker] Error fetching certificate:", error);
        }
      },
      1 * 60 * 1000,
    ); // 1 minutes

    return () => {
      console.log(
        "[KycCertChecker] Cleaning up interval on component unmount.",
      );
      clearInterval(interval);
    };
  }, [
    status,
    accountCert,
    setStatus,
    setKycCert,
    setDocumentStatus,
    accountId,
    documentStatus,
  ]);

  return showRejectionPopup ? (
    <KycRejectionPopup
      reason={rejectionReason}
      onClose={() => setShowRejectionPopup(false)}
    />
  ) : null;
};

export default KycCertChecker;
