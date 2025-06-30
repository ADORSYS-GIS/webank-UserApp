// GeneralQRScannerPage.tsx - For Transfer, Payment, Withdraw, and other QR codes only
// ... existing code from QRScannerPage.tsx ...

import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDisableScroll from "../hooks/useDisableScroll";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import ConfirmationBottomSheet from "./ConfirmationPage";
import SaveContactModal from "../components/SaveContactModal";
import { ContactService } from "../services/contactService";
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
  name?: string;
  amount?: number;
  timeGenerated?: number;
}

const GeneralQRScannerPage: React.FC = () => {
  useDisableScroll();
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
      // Check for required fields
      const requiredFields = ["accountId"];

      // Check if all required fields are present
      for (const field of requiredFields) {
        if (!(field in data)) {
          throw new Error(
            `Invalid QR Code format. Missing required field: ${field}`,
          );
        }
      }

      // Validate field types
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
        console.log("Raw decoded text:", decodedText);
        const data = JSON.parse(decodedText) as QRData;
        console.log("Parsed QR data:", data);

        if (!validateQRCode(data)) return;

        // Check if contact exists first
        const existingContact = ContactService.getContactByAccountId(
          data.accountId,
        );
        console.log("Existing contact:", existingContact);

        if (!existingContact) {
          console.log("No existing contact, showing save contact modal");
          setScannedAccountId(data.accountId);
          setScannedName(data.name ?? null);
          setShowSaveContact(true);
          return;
        }

        if (show === "Transfer" || show === "Payment" || show === "Withdraw") {
          console.log("Navigating to top-up for:", show);
          handleTransferOrPayment(data);
        } else {
          console.log("Showing confirmation sheet for regular transaction");
          showConfirmationSheet(data);
        }
      } catch (err) {
        console.error("Error parsing QR data:", err);
        toast.error("Invalid QR code. Try again.");
      }
    },
    [validateQRCode, show, handleTransferOrPayment, showConfirmationSheet],
  );

  const { error, handleFileUpload, stopScanner } = useQRScannerCore({
    onDecodedText: handleDecodedText,
    sharedImage,
  });

  // Stop scanner when component unmounts
  React.useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isClientOffline ? "Scan Agent QR Code" : "Scan Client QR Code"}
        </h2>

        {/* Scanner Container with Frame */}
        <div className="relative mx-auto w-full aspect-square">
          <div id="qr-reader" className="w-full h-full overflow-hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute bottom-4 text-white/90 text-sm font-medium backdrop-blur-sm px-2 py-1 rounded">
              Align QR code within frame
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <label className="block w-full max-w-[280px] mx-auto bg-blue-600 text-white py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
          Upload QR Image{" "}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full max-w-[280px] mx-auto bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancel
        </button>
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </div>

      {/* Save Contact Modal */}
      {showSaveContact && scannedAccountId && (
        <SaveContactModal
          isOpen={showSaveContact}
          onClose={handleContactCancel}
          accountId={scannedAccountId}
          defaultName={scannedName || ""}
          onSave={handleContactSave}
        />
      )}

      {/* Confirmation Bottom Sheet */}
      {showConfirmation && confirmationData && (
        <ConfirmationBottomSheet
          data={confirmationData}
          onDismiss={handleConfirmationDismiss}
        />
      )}
    </div>
  );
};

export default GeneralQRScannerPage;
