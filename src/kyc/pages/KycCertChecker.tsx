import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/Store"; // Ensure this is the correct path
import {
  setStatus,
  setKycCert,
  setDocumentStatus,
} from "../../slices/accountSlice"; // Updated Redux actions
import { RequestToGetCert } from "../../services/keyManagement/requestService";
import KycRejectionPopup from "../components/KycRejectionPopup";

const KycCertChecker = () => {
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.account.status);
  const documentStatus = useSelector(
    (state: RootState) => state.account.documentStatus,
  );
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  const accountId = useSelector((state: RootState) => state.account.accountId);
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
                  "[KycCertChecker] Certificate found. Updating Redux state...",
                );
                dispatch(setKycCert(certificate)); // Store the certificate in Redux
                dispatch(setStatus("APPROVED")); // Change status to APPROVED
                dispatch(setDocumentStatus("APPROVED")); // Change status to APPROVED
                clearInterval(interval); // Stop making requests
                console.log(
                  "[KycCertChecker] Polling stopped as certificate is received.",
                );
              }
            } else if (response.includes("REJECTED")) {
              console.log(
                "[KycCertChecker] Application rejected. Updating Redux state...",
              );
              dispatch(setStatus("REJECTED"));
              dispatch(setDocumentStatus("REJECTED"));
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
  }, [status, accountCert, dispatch, accountId, documentStatus]);

  return showRejectionPopup ? (
    <KycRejectionPopup
      reason={rejectionReason}
      onClose={() => setShowRejectionPopup(false)}
    />
  ) : null;
};

export default KycCertChecker;
