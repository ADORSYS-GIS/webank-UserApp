import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { ContactService } from "@services/contacts/contactService";
import { useQRScannerCore } from "./useQRScannerCore";

interface ConfirmationData {
  clientAccountId: string;
  amount: number;
  agentAccountId: string;
  agentAccountCert: string;
  show: string;
  clientName: string;
}

interface QRData {
  accountId: string;
  amount: number;
  timeGenerated: number;
  name?: string;
}

export function useTopUpQRScanner() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const [showSaveContact, setShowSaveContact] = useState(false);
  const [scannedAccountId, setScannedAccountId] = useState<string | null>(null);
  const [scannedName, setScannedName] = useState<string | null>(null);
  const [scannedAmount, setScannedAmount] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isClientOffline = location.state?.isClientOffline;
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
        show: "Top Up",
        clientName: data.name ?? "Anonymous",
      };
      setConfirmationData(confirmationData);
      setShowConfirmation(true);
    },
    [agentAccountId, agentAccountCert],
  );

  const handleContactSave = () => {
    toast.success("Contact saved successfully");
    setShowSaveContact(false);
    if (scannedAccountId && scannedAmount) {
      showConfirmationSheet({
        accountId: scannedAccountId,
        amount: scannedAmount,
        timeGenerated: Date.now(),
        name: scannedName ?? undefined,
      });
    }
  };

  const handleContactCancel = () => {
    setShowSaveContact(false);
    if (scannedAccountId && scannedAmount) {
      showConfirmationSheet({
        accountId: scannedAccountId,
        amount: scannedAmount,
        timeGenerated: Date.now(),
        name: scannedName ?? undefined,
      });
    }
  };

  const validateQRCode = useCallback(
    (data: QRData) => {
      const requiredFields = ["accountId", "amount"];
      for (const field of requiredFields) {
        if (!(field in data)) {
          throw new Error(
            `Invalid Top Up QR Code format. Missing required field: ${field}`,
          );
        }
      }
      if (typeof data.accountId !== "string") {
        throw new Error(
          "Invalid Top Up QR Code format. accountId must be a string.",
        );
      }
      if (typeof data.amount !== "number") {
        throw new Error(
          "Invalid Top Up QR Code format. amount must be a number.",
        );
      }
      if (typeof data.timeGenerated !== "number") {
        throw new Error(
          "Invalid Top Up QR Code format. timeGenerated must be a number.",
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
        const existingContact = ContactService.getContactByAccountId(
          data.accountId,
        );
        if (!existingContact) {
          setScannedAccountId(data.accountId);
          setScannedName(data.name ?? null);
          setScannedAmount(data.amount);
          setShowSaveContact(true);
          return;
        }
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
    isClientOffline,
    showSaveContact,
    scannedAccountId,
    scannedName,
    handleContactCancel,
    handleContactSave,
    scannedAmount,
  };
}
