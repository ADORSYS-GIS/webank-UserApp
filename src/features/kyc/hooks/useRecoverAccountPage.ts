import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { toast } from "sonner";
import { setAccountCert, setAccountId, setKycCert } from "@state/accountSlice";
import {
  RequestToSubmitRecoveryToken,
  RequestToRecoverAccountCert,
} from "@services/keyManagement/requestService";

export function useRecoverAccountPage() {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const dispatch = useDispatch();
  const supportPhoneNumber = "+237654066316";

  // Handles contacting support via WhatsApp
  const handleKYCRecovery = () => {
    const accountIdText = accountId ? `Account ID: ${accountId}\n\n` : "";
    const customMessage = encodeURIComponent(
      `Welcome to KYC Recovery!\n\n` + accountIdText + `My name is : `,
    );
    const whatsappLink = `https://api.whatsapp.com/send?phone=${supportPhoneNumber}&text=${customMessage}`;
    window.open(whatsappLink, "_blank");
  };

  // Handles recovery token submission
  const handleTokenSubmit = async () => {
    let data = "";
    let oldAccountId = "";
    let kycCert = "";
    try {
      if (!token.trim()) {
        toast.error("Please enter a valid recovery token.");
        return;
      }
      if (!accountId || !accountCert) {
        toast.error("Account information is missing.");
        return;
      }
      data = await RequestToSubmitRecoveryToken(accountId, token, accountCert);
      oldAccountId = data?.split(" ")[0];
      kycCert = data?.split(" ")[1];
      const isInvalidToken = (value: string | null | undefined): boolean =>
        value === "null" || !value;
      if (isInvalidToken(oldAccountId) || isInvalidToken(kycCert)) {
        toast.error("Invalid token. Please try again.");
        return;
      }
      localStorage.setItem("accountId", oldAccountId);
      localStorage.setItem("kycCert", kycCert);
      dispatch(setKycCert(kycCert));
      dispatch(setAccountId(oldAccountId));
      setShowTokenInput(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error submitting token:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handles confirmation of account recovery
  const handleYesClick = async () => {
    try {
      if (!accountId) {
        toast.error("Account information is missing.");
        return;
      }
      const certResponse = await RequestToRecoverAccountCert(accountId);
      if (certResponse) {
        localStorage.setItem("accountCert", certResponse);
        dispatch(setAccountCert(certResponse));
        toast.success("Account recovery successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Failed to recover account certificate. Please try again.");
      }
    } catch (error) {
      console.error("Error recovering account certificate:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setShowConfirmation(false);
    }
  };

  // Handles cancel action
  const handleCancel = () => {
    navigate("/settings");
  };

  return {
    showTokenInput,
    setShowTokenInput,
    token,
    setToken,
    showConfirmation,
    setShowConfirmation,
    handleKYCRecovery,
    handleTokenSubmit,
    handleYesClick,
    handleCancel,
    accountId,
    accountCert,
    navigate,
    supportPhoneNumber,
  };
}
