import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import useDisableScroll from "../hooks/useDisableScroll";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { signTransaction } from "../services/keyManagement/signTransaction";

const QRGenerator: React.FC = () => {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const totalamount = location.state?.totalAmount;
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountJwt = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  // State to store the generated signature
  const [signatureValue, setSignatureValue] = useState<string | null>(null);

  // Generate the signature when the component mounts
  useEffect(() => {
    const generateSignature = async () => {
      try {
        if (accountId && totalamount && accountJwt) {
          const signature = await signTransaction(
            accountId,
            totalamount,
            accountJwt,
          );
          setSignatureValue(signature); // Store the signature in state
          console.log("Generated Signature:", signature);
        } else {
          console.warn("Missing data, cannot generate signature.");
        }
      } catch (error) {
        console.error("Error generating signature:", error);
      }
    };
    generateSignature();
  }, [accountId, totalamount, accountJwt]);

  const qrRef = useRef<HTMLCanvasElement>(null);

  // Determine if the user is online or offline
  const isOnline = navigator.onLine;

  // Generate QR Code content with predefined values
  const qrValue = JSON.stringify({
    accountId: accountId,
    amount: totalamount,
    // Add signature only if offline
    ...(signatureValue && !isOnline ? { signature: signatureValue } : {}),
  });

  // Function to download QR code
  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png"); // Convert canvas to image URL
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png"; // Set download file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-100 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Top-Up QR Code
        </h2>

        {/* QR Code Display */}
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg mb-8">
          <QRCodeCanvas value={qrValue} size={250} ref={qrRef} />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            onClick={downloadQRCode}
            className="px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg shadow-lg transform transition duration-300 hover:bg-green-700 hover:scale-105 focus:outline-none"
          >
            Download QR Code
          </button>

          <button
            onClick={() => navigate("/qr-scan")}
            className="px-6 py-3 text-lg font-medium text-white bg-orange-600 rounded-lg shadow-lg transform transition duration-300 hover:bg-orange-700 hover:scale-105 focus:outline-none"
          >
            Scan Instead!
          </button>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg transform transition duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none"
          >
            ← Back to Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
