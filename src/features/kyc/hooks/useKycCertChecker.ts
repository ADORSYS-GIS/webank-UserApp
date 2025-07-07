import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@state/Store";
import { setStatus, setKycCert, setDocumentStatus } from "@state/accountSlice";
import { RequestToGetCert } from "@services/keyManagement/requestService";

export function useKycCertChecker() {
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
    if (status === null || status === "APPROVED") {
      return;
    }
    const interval = setInterval(async () => {
      try {
        if (!accountCert || !accountId) {
          clearInterval(interval);
          return;
        }
        const response = await RequestToGetCert(accountId, accountCert);
        if (response && typeof response === "string") {
          if (response.includes("certificate")) {
            const certificate = response
              .replace("Your certificate is:", "")
              .trim();
            if (certificate) {
              dispatch(setKycCert(certificate));
              dispatch(setStatus("APPROVED"));
              dispatch(setDocumentStatus("APPROVED"));
              clearInterval(interval);
            }
          } else if (response.includes("rejected")) {
            setShowRejectionPopup(true);
            setRejectionReason(response);
            dispatch(setStatus("REJECTED"));
            dispatch(setDocumentStatus("REJECTED"));
            clearInterval(interval);
          }
        }
      } catch (error) {
        // Optionally handle error
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [status, accountCert, accountId, dispatch]);

  return {
    showRejectionPopup,
    setShowRejectionPopup,
    rejectionReason,
    setRejectionReason,
    status,
    documentStatus,
  };
}
