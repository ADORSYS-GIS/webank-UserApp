import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QRScannerPage: React.FC = () => {
  const [amount, setAmount] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startScanner = async () => {
      try {
        const qrScanner = new Html5Qrcode("qr-reader");
        scannerRef.current = qrScanner;

        await qrScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              if (data.amount && data.accountId) {
                setAmount(data.amount);
                setAccountId(data.accountId);
                setError(null);
                qrScanner.stop();

                navigate("/confirmation", {
                  state: { amount: data.amount, accountId: data.accountId },
                });
              } else {
                throw new Error("Invalid QR Code format");
              }
            } catch (err) {
              setError("Failed to read QR code. Please try again.");
            }
          },
          (errorMessage) => {
            console.log("Scanning error:", errorMessage);
          },
        );
      } catch (err) {
        setError("Unable to access camera. Please allow camera permissions.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Scan Client QR Code
        </h2>
        {/* QR Scanner Container */}
        <div id="qr-reader" className="mb-6 w-full max-w-sm mx-auto"></div>
        {/* Cancel Button inside the scan frame (only visible before scan success) */}
        {!amount && (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            Cancel
          </button>
        )}
        {/* Error Message */}
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}{" "}
        {/* Display error message */}
        {/* Debug: Display accountId for internal use */}
        {accountId && (
          <p className="text-gray-600 mt-4">Account ID: {accountId}</p>
        )}{" "}
        {/* Display accountId for debugging */}
      </div>
    </div>
  );
};

export default QRScannerPage;
