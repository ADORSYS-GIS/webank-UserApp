import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@state/Store";

export interface UseTopUpPageResult {
  amount: number | string;
  setAmount: (a: number | string) => void;
  showConfirmation: boolean;
  setShowConfirmation: (b: boolean) => void;
  handleContinue: () => void;
  handleCancel: () => void;
  handleConfirmationDismiss: () => void;
  clientAccountId: string | undefined;
  show: string | undefined;
  agentAccountCert: string | undefined;
  agentAccountId: string | undefined;
}

export function useTopUpPage(): UseTopUpPageResult {
  const [amount, setAmount] = useState<number | string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const clientAccountId = location.state?.clientAccountId;
  const show = location.state?.show;

  const agentAccountCert = location.state?.agentAccountCert;
  const agentAccountId = location.state?.agentAccountId;
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);

  const handleContinue = () => {
    const numericAmount = Number(amount);
    if (numericAmount <= 0) {
      toast.info("Please enter a valid amount.");
      return;
    }
    if (numericAmount > 1000 && kycCert == null && status !== "APPROVED") {
      toast.info("KYC is required for transfers over 1000 XAF.");
      return;
    }
    if (numericAmount > 500000) {
      toast.info("Maximum top-up amount is 500,000 XAF.");
      return;
    }
    if (show === "Transfer" || show === "Payment" || show === "Withdraw") {
      setShowConfirmation(true);
    } else {
      navigate("/qrcode", {
        state: {
          totalAmount: numericAmount,
          accountId: clientAccountId,
          show,
        },
      });
    }
  };

  const handleCancel = () => {
    navigate("/dashboard", {
      state: { accountId: clientAccountId },
    });
  };

  const handleConfirmationDismiss = () => {
    setShowConfirmation(false);
  };

  return {
    amount,
    setAmount,
    showConfirmation,
    setShowConfirmation,
    handleContinue,
    handleCancel,
    handleConfirmationDismiss,
    clientAccountId,
    show,

    agentAccountCert,
    agentAccountId,
  };
}
