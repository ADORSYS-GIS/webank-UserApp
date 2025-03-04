import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useDisableScroll from "../hooks/useDisableScroll";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";

const QRScannerPage: React.FC = () => {
  useDisableScroll();
  const [amount, setAmount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();

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
        scannerRef.current = null; // Reset scanner reference
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  // Handle decoded QR Code
  const handleDecodedText = useCallback(
    (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        if (data.accountId && data.amount && data.timeGenerated) {
          setAmount(data.amount.toString());
          setError(null);
          stopScanner(); // Stop scanner after successful scan

          // Validate QR code time (expires after 60 seconds)
          const isExpired = Date.now() - data.timeGenerated > 60000;
          if (isExpired) {
            toast.error("QR Code expired. Please try again.");
            return window.location.reload();
          }

          // Prevent self-transfers
          if (data.accountId === agentAccountId) {
            toast.error("Self-transfer not allowed.");
            return window.location.reload();
          }

          // Check if it's an offline transaction
          const isOfflineTransaction = "signature" in data;
          const signature = data.signature;

          navigate("/confirmation", {
            state: {
              amount: data.amount,
              clientAccountId: data.accountId,
              agentAccountId,
              agentAccountCert,
              ...(isOfflineTransaction ? { transactionJwt: signature } : {}),
            },
          });
        } else {
          throw new Error("Invalid QR Code format.");
        }
      } catch (err) {
        setError("Failed to read QR code. Please try again.");
        toast.error("Invalid QR code. Try again.");
      }
    },
    [navigate, agentAccountId, agentAccountCert],
  );

  const handleScanDecodedText = useCallback(
    (decodedText: string) => {
      setTimeout(() => handleDecodedText(decodedText), 2000);
    },
    [handleDecodedText],
  );

  const handleScanError = useCallback((errorMessage: string) => {
    console.log("Scanning error:", errorMessage);
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      await stopScanner(); // Ensure previous scanner is stopped

      if (!scannerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode("qr-reader");

          await scannerRef.current.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 350, height: 350 } },
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
  }, [handleScanDecodedText, handleScanError]); // Add handleScanDecodedText as a dependency

  // Handle file upload for QR code scanning
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file type
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type. Please upload a PNG or JPEG image.");
        toast.error("Invalid file format. Use PNG or JPG.");
        return;
      }

      try {
        await stopScanner(); // Stop the scanner before scanning the image
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Scan Client QR Code
        </h2>

        <div id="qr-reader" className="mb-6 w-full max-w-sm mx-auto"></div>

        <label className="block w-full text-center bg-blue-400 text-white font-medium py-2 rounded-lg cursor-pointer hover:bg-blue-700">
          Upload QR Code Image{" "}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {!amount && (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 mt-4"
          >
            Cancel
          </button>
        )}

        {error && <p className="text-red-600 font-medium mt-4">{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default QRScannerPage;
