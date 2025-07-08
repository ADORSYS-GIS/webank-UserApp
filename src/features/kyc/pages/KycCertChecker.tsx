import { useEffect, useState } from "react";
import { useAccountStore } from "@state/accountStore";
import KycRejectionPopup from "../components/KycRejectionPopup";
import { useKycServiceGetApiPrsKycCertByAccountId } from "@openapi/generated/prs/queries/queries";

const KycCertChecker = () => {
  const { status, accountId, setStatus, setKycCert, setDocumentStatus } =
    useAccountStore();
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Use OpenAPI TanStack Query hook with polling
  const {
    data: certData,
    error,
    isError,
  } = useKycServiceGetApiPrsKycCertByAccountId(
    { accountId: accountId || "" },
    undefined,
    {
      enabled: !!accountId && status === "PENDING",
      refetchInterval: status === "PENDING" ? 60000 : false, // poll every 1 min
      retry: false,
    },
  );

  useEffect(() => {
    if (!certData || status !== "PENDING") return;
    if (typeof certData === "string") {
      if (certData.includes("certificate")) {
        const certificate = certData.replace("Your certificate is:", "").trim();
        if (certificate) {
          setKycCert(certificate);
          setStatus("APPROVED");
          setDocumentStatus("APPROVED");
        }
      } else if (certData.includes("REJECTED")) {
        setStatus("REJECTED");
        setDocumentStatus("REJECTED");
        setRejectionReason(certData.replace("REJECTED: ", ""));
        setShowRejectionPopup(true);
      }
    }
  }, [certData, status, setKycCert, setStatus, setDocumentStatus]);

  useEffect(() => {
    if (isError && error) {
      // Optionally show a toast or log error
      console.error("[KycCertChecker] Error fetching certificate:", error);
    }
  }, [isError, error]);

  return showRejectionPopup ? (
    <KycRejectionPopup
      reason={rejectionReason}
      onClose={() => setShowRejectionPopup(false)}
    />
  ) : null;
};

export default KycCertChecker;
