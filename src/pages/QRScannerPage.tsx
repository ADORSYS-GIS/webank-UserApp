import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";

const QRScannerPage: React.FC = () => {
  const [amount, setAmount] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { otherAccountId, accountCert } = location.state || {};
  console.log("id is " + otherAccountId, "cert is" + accountCert);

  // Memoize handleDecodedText using useCallback to prevent unnecessary re-renders
  const handleDecodedText = useCallback(
    (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        if (data.accountID1 && data.amount) {
          setAmount(data.amount);
          setAccountId(data.accountID1);
          setError(null);
          scannerRef.current?.stop();

          navigate("/confirmation", {
            state: {
              amount: data.amount,
              accountId: data.accountID1,
              otherAccountId,
              accountCert,
            },
          });
        } else {
          throw new Error("Invalid QR Code format");
        }
      } catch (err) {
        setError("Failed to read QR code. Please try again.");
      }
    },
    [accountCert, navigate, otherAccountId],
  );

  useEffect(() => {
    const startScanner = async () => {
      try {
        const qrScanner = new Html5Qrcode("qr-reader");
        scannerRef.current = qrScanner;

        await qrScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => handleDecodedText(decodedText),

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
  }, [handleDecodedText]);

  // Function to scan a QR code from an uploaded image
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const qrScanner = new Html5Qrcode("qr-reader");
        const result = await qrScanner.scanFile(file, false);
        handleDecodedText(result);
      } catch (err) {
        setError("Failed to read QR code from image. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Scan Client QR Code
        </h2>
        {/* QR Scanner Container */}
        <div id="qr-reader" className="mb-6 w-full max-w-sm mx-auto"></div>

        {/* Upload QR Code Image */}
        <label className="block w-full text-center bg-blue-400 text-white font-medium py-2 rounded-lg cursor-pointer hover:bg-blue-700">
          Upload QR Code Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Cancel Button inside the scan frame (only visible before scan success) */}
        {!amount && (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 mt-4"
          >
            Cancel
          </button>
        )}

        {/* Error Message */}
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

        {/* Debug: Display accountId for internal use */}
        {accountId && (
          <p className="text-gray-600 mt-4">Account ID: {accountId}</p>
        )}
      </div>
    </div>
  );
};

export default QRScannerPage;
