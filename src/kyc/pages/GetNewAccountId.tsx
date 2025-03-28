import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useDisableScroll from "../../hooks/useDisableScroll";

const GetNewAccountId: React.FC = () => {
  useDisableScroll();
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const oldAccountId = location.state.oldAccountId;

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

  // Process the decoded QR code immediately
  const handleDecodedText = useCallback(
    (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        if (data.accountId) {
          stopScanner();
          navigate("/recovery/account-confirmation", {
            state: { accountId: data.accountId, oldAccountId },
          });
        } else {
          throw new Error("Invalid QR Code: Missing accountId");
        }
      } catch (err) {
        setError("Failed to read recovery QR code. Please try again.");
        toast.error("Invalid QR code. Try again.");
      }
    },
    [navigate, oldAccountId],
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
            handleDecodedText,
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
  }, [handleDecodedText, handleScanError]);

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
          Scan Recovery QR Code
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
          Upload QR Image
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
      <ToastContainer />
    </div>
  );
};

export default GetNewAccountId;
