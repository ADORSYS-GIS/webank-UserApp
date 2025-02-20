import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const QRScannerPage: React.FC = () => {
  const [amount, setAmount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { agentAccountId, agentAccountCert } = location.state || {};

  console.log("id is " + agentAccountId, "cert is" + agentAccountCert);

  // Stop the scanner safely
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null; // Reset the reference
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
        if (data.accountId && data.amount) {
          setAmount(data.amount);
          setError(null);
          stopScanner(); // Stop scanner after successful scan

          if (data.accountId === agentAccountId) {
            toast.error("Self-transfer not allowed");
          } else {
            navigate("/confirmation", {
              state: {
                amount: data.amount,
                clientAccountId: data.accountId,
                agentAccountId,
                agentAccountCert,
              },
            });
          }
        } else {
          throw new Error("Invalid QR Code format");
        }
      } catch (err) {
        setError("Failed to read QR code. Please try again.");
      }
    },
    [navigate, agentAccountId, agentAccountCert],
  );

  useEffect(() => {
    const startScanner = async () => {
      if (!scannerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode("qr-reader");
          await scannerRef.current.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => handleDecodedText(decodedText),
            (errorMessage) => console.log("Scanning error:", errorMessage),
          );
        } catch (err) {
          setError("Unable to access camera. Please allow camera permissions.");
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [handleDecodedText]);

  // Handle file upload for QR code scanning
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        await stopScanner(); // Ensure scanner is stopped before file scanning
        const qrScanner = new Html5Qrcode("qr-reader");

        // Ensure the image is a valid type
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          setError("Unsupported file type. Please upload a PNG or JPEG image.");
          return;
        }

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
            onClick={() =>
              navigate("/dashboard", {
                state: {
                  accountId: agentAccountId,
                  accountCert: agentAccountCert,
                },
              })
            }
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 mt-4"
          >
            Cancel
          </button>
        )}

        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default QRScannerPage;
