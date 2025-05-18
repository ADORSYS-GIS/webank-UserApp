import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import useDisableScroll from "../hooks/useDisableScroll";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import ConfirmationBottomSheet from "./ConfirmationPage";
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

const OfflineQRScannerPage: React.FC = () => {
  useDisableScroll();
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
      // Check for exactly four required fields
      //   const requiredFields = ['accountId', 'amount', 'timeGenerated', 'signature'];
      //   const dataFields = Object.keys(data);

      //   if (dataFields.length !== requiredFields.length) {
      //     throw new Error("Invalid Offline QR Code format. Must contain exactly four fields: accountId, amount, timeGenerated, and signature.");
      //   }

      // Check if all required fields are present
      //   for (const field of requiredFields) {
      //     if (!(field in data)) {
      //       throw new Error(`Invalid Offline QR Code format. Missing required field: ${field}`);
      //     }
      //   }

      // Validate field types
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
        console.log("Raw decoded text:", decodedText);
        const data = JSON.parse(decodedText) as QRData;
        console.log("Parsed QR data:", data);

        if (!data.name) {
          data.name = "Anonymous";
        }

        if (!validateQRCode(data)) return;

        console.log("Showing confirmation sheet for offline transaction");
        showConfirmationSheet(data);
      } catch (err) {
        console.error("Error parsing QR data:", err);
        toast.error("Invalid QR code. Try again.");
      }
    },
    [validateQRCode, showConfirmationSheet],
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
          Scan Offline Withdrawal QR Code
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
          onClick={() => navigate("/")}
          className="w-full max-w-[280px] mx-auto bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancel
        </button>
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </div>

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

export { OfflineQRScannerPage as Component };
