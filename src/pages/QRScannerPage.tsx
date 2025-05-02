import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDisableScroll from "../hooks/useDisableScroll";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import ConfirmationBottomSheet from "./ConfirmationPage";
import SaveContactModal from "../components/SaveContactModal";
import { ContactService, Contact } from "../services/contactService";

interface ConfirmationData {
  clientAccountId: string;
  amount: number;
  agentAccountId: string;
  agentAccountCert: string;
  transactionJwt?: string;
  show: string;
  clientName: string;
}

interface QRData {
  accountId: string;
  amount: number;
  timeGenerated: number;
  signature?: string;
  name?: string; // Make name optional since it might not exist in all QR codes
}

const QRScannerPage: React.FC = () => {
  useDisableScroll();
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isClientOffline = location.state?.isClientOffline;
  const show = location.state?.show;
  const [showSaveContact, setShowSaveContact] = useState(false);
  const [scannedAccountId, setScannedAccountId] = useState<string | null>(null);
  const [scannedName, setScannedName] = useState<string | null>(null);

  const agentAccountId = useSelector(
    (state: RootState) => state.account.accountId,
  );
  const agentAccountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  console.log("Agent ID:", agentAccountId, "Cert:", agentAccountCert);

  // Stop the scanner safely
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleConfirmationDismiss = () => {
    setShowConfirmation(false);
  };

  const handleTransferOrPayment = useCallback(
    (data: QRData) => {
      setError(null);
      stopScanner();
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
          clientName: data.name ?? "Anonymous", // Pass the client name
        },
      });
    },
    [agentAccountId, agentAccountCert, navigate, show],
  );

  const showConfirmationSheet = useCallback(
    (data: QRData, isOfflineTransaction: boolean, signature?: string) => {
      if (!agentAccountId || !agentAccountCert) {
        toast.error("Missing account information. Please try again.");
        return;
      }

      console.log("QR Data with Name:", data);
      console.log("Name from QR:", data.name);

      // Check if contact already exists
      const existingContact = ContactService.getContactByAccountId(
        data.accountId,
      );

      // If contact doesn't exist, show save contact modal first
      if (!existingContact) {
        setScannedAccountId(data.accountId);
        setScannedName(data.name ?? null);
        setShowSaveContact(true);
        return; // Return early to wait for contact save
      }

      const confirmationData = {
        amount: data.amount,
        clientAccountId: data.accountId,
        agentAccountId,
        agentAccountCert,
        ...(isOfflineTransaction ? { transactionJwt: signature } : {}),
        show: show || "",
        clientName: data.name ?? "Anonymous",
      };

      console.log("Confirmation Data being set:", confirmationData);
      setConfirmationData(confirmationData);
      setShowConfirmation(true);
    },
    [agentAccountId, agentAccountCert, show],
  );

  const handleContactSave = (contact: Contact) => {
    console.log("Contact saved:", contact);
    toast.success("Contact saved successfully");
    setShowSaveContact(false);

    // Navigate to TopUpPage after saving contact
    if (confirmationData) {
      navigate("/top-up", {
        state: {
          clientAccountId: confirmationData.clientAccountId,
          agentAccountId: confirmationData.agentAccountId,
          agentAccountCert: confirmationData.agentAccountCert,
          show: confirmationData.show,
          clientName: confirmationData.clientName,
          amount: confirmationData.amount,
        },
      });
    }
  };

  const handleContactCancel = () => {
    setShowSaveContact(false);

    // Proceed to TopUpPage even when contact saving is cancelled
    if (confirmationData) {
      navigate("/top-up", {
        state: {
          clientAccountId: confirmationData.clientAccountId,
          agentAccountId: confirmationData.agentAccountId,
          agentAccountCert: confirmationData.agentAccountCert,
          show: confirmationData.show,
          clientName: confirmationData.clientName,
          amount: confirmationData.amount,
        },
      });
    }
  };

  const validateQRCode = useCallback(
    (data: QRData) => {
      console.log("Validating QR Data:", data);
      // Basic validation - at least accountId must be present
      if (!data.accountId) {
        throw new Error("Invalid QR Code format. Missing account ID.");
      }

      // If this is a payment/transfer QR code, validate required fields
      if (data.amount !== undefined) {
        if (!data.timeGenerated) {
          throw new Error("Invalid QR Code format. Missing timestamp.");
        }

        const isExpired = Date.now() - data.timeGenerated > 15 * 60000;
        if (isExpired) {
          toast.error("QR Code expired. Please try again.");
          window.location.reload();
          return false;
        }
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

  const prepareConfirmationData = useCallback(
    (
      data: QRData,
      isOfflineTransaction: boolean,
      signature?: string,
    ): ConfirmationData => {
      return {
        amount: data.amount || 0,
        clientAccountId: data.accountId,
        agentAccountId: agentAccountId || "",
        agentAccountCert: agentAccountCert || "",
        ...(isOfflineTransaction ? { transactionJwt: signature } : {}),
        show: show || "",
        clientName: data.name ?? "Anonymous",
      };
    },
    [agentAccountId, agentAccountCert, show],
  );

  const handleNewContact = useCallback(
    (data: QRData, isOfflineTransaction: boolean, signature?: string) => {
      setScannedAccountId(data.accountId);
      setScannedName(data.name ?? null);
      setShowSaveContact(true);

      if (agentAccountId && agentAccountCert) {
        const tempConfirmationData = prepareConfirmationData(
          data,
          isOfflineTransaction,
          signature,
        );
        setConfirmationData(tempConfirmationData);
      }
    },
    [agentAccountId, agentAccountCert, prepareConfirmationData],
  );

  const handleExistingContact = useCallback(
    (data: QRData, isOfflineTransaction: boolean, signature?: string) => {
      if (show === "Transfer" || show === "Payment" || show === "Withdraw") {
        handleTransferOrPayment(data);
      } else {
        stopScanner();
        showConfirmationSheet(data, isOfflineTransaction, signature);
      }
    },
    [show, handleTransferOrPayment, showConfirmationSheet],
  );

  const handleDecodedText = useCallback(
    (decodedText: string) => {
      console.log("Raw decoded text:", decodedText);

      try {
        const data = JSON.parse(decodedText) as QRData;
        console.log("Parsed QR Data:", data);

        // Ensure name is present, set a default if needed
        if (!data.name) {
          data.name = "Anonymous";
        }

        // Debug: Log the data with name after setting default
        console.log("QR Data after name defaulting:", data);

        // Validate the QR code data
        if (!validateQRCode(data)) return;

        const isOfflineTransaction = "signature" in data;
        const signature = data.signature;

        // Check if contact exists first
        const existingContact = ContactService.getContactByAccountId(
          data.accountId,
        );

        if (!existingContact) {
          handleNewContact(data, isOfflineTransaction, signature);
          return;
        }

        handleExistingContact(data, isOfflineTransaction, signature);
      } catch (err) {
        console.error("Error parsing QR data:", err);
        setError("Failed to read QR code. Please try again.");
        toast.error("Invalid QR code. Try again.");
      }
    },
    [validateQRCode, handleNewContact, handleExistingContact],
  );

  // Process decoded text immediately without delay
  const handleScanDecodedText = useCallback(
    (decodedText: string) => {
      handleDecodedText(decodedText);
    },
    [handleDecodedText],
  );

  const handleScanError = useCallback((errorMessage: string) => {
    console.log("Scanning error:", errorMessage);
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      await stopScanner();
      if (!scannerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode("qr-reader");
          await scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 30,
              qrbox: { width: 400, height: 400 },
              aspectRatio: 1.0,
              disableFlip: true,
            },
            handleScanDecodedText,
            handleScanError,
          );
        } catch (err) {
          setError("Unable to access camera. Please allow camera permissions.");
          toast.error("Camera access denied. Enable permissions.");
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [handleScanDecodedText, handleScanError]);

  // Handle shared image from navigation state
  useEffect(() => {
    const sharedImage = location.state?.sharedImage;
    if (sharedImage) {
      const processSharedImage = async () => {
        try {
          // Convert base64 to File
          const response = await fetch(sharedImage);
          const blob = await response.blob();
          const file = new File([blob], "shared-qr.png", { type: blob.type });

          // Stop camera scanner to avoid conflicts
          await stopScanner();

          // Scan the shared image
          const qrScanner = new Html5Qrcode("qr-reader");
          const result = await qrScanner.scanFile(file, false);
          handleDecodedText(result);
        } catch (err) {
          setError(
            "Failed to read QR code from shared image. Please try again.",
          );
          toast.error(
            "Invalid QR code in shared image. Try scanning manually.",
          );
        }
      };

      processSharedImage();
    }
  }, [location.state, handleDecodedText]);

  // Handle file upload for QR code scanning
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type. Please upload a PNG or JPEG image.");
        toast.error("Invalid file format. Use PNG or JPG.");
        return;
      }
      try {
        await stopScanner();
        const qrScanner = new Html5Qrcode("qr-reader");
        const result = await qrScanner.scanFile(file, false);
        handleDecodedText(result);
      } catch (err) {
        setError("Failed to read QR code from image. Please try again.");
        toast.error("QR code scanning failed. Try another image.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isClientOffline ? "Scan Client QR Code" : "Scan Agent QR Code"}
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

export default QRScannerPage;
