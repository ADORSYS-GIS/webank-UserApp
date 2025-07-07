import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { useQRScannerCore } from "./useQRScannerCore";

interface ConfirmationData {
  clientAccountId: string;
  amount: number;
  agentAccountId: string;
  agentAccountCert: string;
  transactionJwt: string;
  show: string;
  clientName: string;
}

interface QRData {
  accountId: string;
  amount: number;
  timeGenerated: number;
  signature: string;
  name?: string;
}

export function useOfflineQRScanner() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const sharedImage = location.state?.sharedImage;

  const agentAccountId = useSelector(
    (state: RootState) => state.account.accountId,
  );
  const agentAccountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  const handleConfirmationDismiss = () => {
    setShowConfirmation(false);
  };

  const showConfirmationSheet = useCallback(
    (data: QRData) => {
      if (!agentAccountId || !agentAccountCert) {
        toast.error("Missing account information. Please try again.");
        return;
      }

      const confirmationData = {
        amount: data.amount,
        clientAccountId: data.accountId,
        agentAccountId,
        agentAccountCert,
        transactionJwt: data.signature,
        show: "Withdraw",
        clientName: data.name ?? "Anonymous",
      };

      setConfirmationData(confirmationData);
      setShowConfirmation(true);
    },
    [agentAccountId, agentAccountCert],
  );

  const validateQRCode = useCallback(
    (data: QRData) => {
      if (typeof data.accountId !== "string") {
        throw new Error(
          "Invalid Offline QR Code format. accountId must be a string.",
        );
      }
      if (typeof data.amount !== "number") {
        throw new Error(
          "Invalid Offline QR Code format. amount must be a number.",
        );
      }
      if (typeof data.timeGenerated !== "number") {
        throw new Error(
          "Invalid Offline QR Code format. timeGenerated must be a number.",
        );
      }
      if (typeof data.signature !== "string") {
        throw new Error(
          "Invalid Offline QR Code format. signature must be a string.",
        );
      }
      const isExpired = Date.now() - data.timeGenerated > 15 * 60000;
      if (isExpired) {
        toast.error("QR Code expired. Please try again.");
        window.location.reload();
        return false;
      }
      if (data.accountId === agentAccountId) {
        toast.error("Self-transfer not allowed.");
        window.location.reload();
        return false;
      }
      return true;
    },
    [agentAccountId],
  );

  const handleDecodedText = useCallback(
    (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText) as QRData;
        if (!data.name) {
          data.name = "Anonymous";
        }
        if (!validateQRCode(data)) return;
        showConfirmationSheet(data);
      } catch (err) {
        toast.error("Invalid QR code. Try again.");
      }
    },
    [validateQRCode, showConfirmationSheet],
  );

  const { error, handleFileUpload } = useQRScannerCore({
    onDecodedText: handleDecodedText,
    sharedImage,
  });

  return {
    showConfirmation,
    confirmationData,
    handleConfirmationDismiss,
    error,
    handleFileUpload,
    navigate,
  };
}
