import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { ContactService } from "@services/contacts/contactService";
import { useQRScannerCore } from "../hooks/useQRScannerCore";

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
  name?: string;
  amount?: number;
  timeGenerated?: number;
}

export function useGeneralQRScanner() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const [showSaveContact, setShowSaveContact] = useState(false);
  const [scannedAccountId, setScannedAccountId] = useState<string | null>(null);
  const [scannedName, setScannedName] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isClientOffline = location.state?.isClientOffline;
  const show = location.state?.show;
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

  const handleTransferOrPayment = useCallback(
    (data: QRData) => {
      if (data.accountId === agentAccountId) {
        toast.error("Self-transfer not allowed.");
        window.location.reload();
        return;
      }
      navigate("/top-up", {
        state: {
          clientAccountId: data.accountId,
          agentAccountId,
          agentAccountCert,
          show,
          clientName: data.name,
        },
      });
    },
    [agentAccountId, agentAccountCert, navigate, show],
  );

  const showConfirmationSheet = useCallback(
    (data: QRData) => {
      if (!agentAccountId || !agentAccountCert) {
        toast.error("Missing account information. Please try again.");
        return;
      }
      const confirmationData = {
        amount: data.amount ?? 0,
        clientAccountId: data.accountId,
        agentAccountId,
        agentAccountCert,
        show: show || "",
        clientName: data.name ?? "Anonymous",
      };
      setConfirmationData(confirmationData);
      setShowConfirmation(true);
    },
    [agentAccountId, agentAccountCert, show],
  );

  const handleContactSave = () => {
    toast.success("Contact saved successfully");
    setShowSaveContact(false);
    if (scannedAccountId) {
      navigate("/top-up", {
        state: {
          clientAccountId: scannedAccountId,
          agentAccountId,
          agentAccountCert,
          show,
          clientName: scannedName ?? "Anonymous",
        },
      });
    }
  };

  const handleContactCancel = () => {
    setShowSaveContact(false);
    if (scannedAccountId) {
      navigate("/top-up", {
        state: {
          clientAccountId: scannedAccountId,
          agentAccountId,
          agentAccountCert,
          show,
          clientName: scannedName ?? "Anonymous",
        },
      });
    }
  };

  const validateQRCode = useCallback(
    (data: QRData) => {
      const requiredFields = ["accountId"];
      for (const field of requiredFields) {
        if (!(field in data)) {
          throw new Error(
            `Invalid QR Code format. Missing required field: ${field}`,
          );
        }
      }
      if (typeof data.accountId !== "string") {
        throw new Error("Invalid QR Code format. accountId must be a string.");
      }
      if (data.name && typeof data.name !== "string") {
        throw new Error(
          "Invalid QR Code format. name must be a string if provided.",
        );
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
        if (!validateQRCode(data)) return;
        const existingContact = ContactService.getContactByAccountId(
          data.accountId,
        );
        if (!existingContact) {
          setScannedAccountId(data.accountId);
          setScannedName(data.name ?? null);
          setShowSaveContact(true);
          return;
        }
        if (show === "Transfer" || show === "Payment" || show === "Withdraw") {
          handleTransferOrPayment(data);
        } else {
          showConfirmationSheet(data);
        }
      } catch (err) {
        toast.error("Invalid QR code. Try again.");
      }
    },
    [validateQRCode, showConfirmationSheet, handleTransferOrPayment, show],
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
  };
}
