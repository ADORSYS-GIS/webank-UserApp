import React from "react";
import { useKycCertChecker } from "../hooks/useKycCertChecker";
import KycRejectionPopup from "../components/KycRejectionPopup";

const KycCertChecker = () => {
  const {
    showRejectionPopup,
    setShowRejectionPopup,
    rejectionReason,
  } = useKycCertChecker();

  return showRejectionPopup ? (
    <KycRejectionPopup
      reason={rejectionReason}
      onClose={() => setShowRejectionPopup(false)}
    />
  ) : null;
};

export default KycCertChecker;
