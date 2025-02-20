import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";

const QRGenerator: React.FC = () => {
  const location = useLocation();
  const totalamount = location.state?.totalAmount;
  const accountId = location.state?.accountId;
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Generate QR Code content with predefined values
  const qrValue = JSON.stringify({
    accountId: accountId,
    amount: totalamount,
  });

  // Function to download QR code with frame
  const downloadQRCode = () => {
    if (qrContainerRef.current) {
      html2canvas(qrContainerRef.current).then((canvas) => {
        const url = canvas.toDataURL("image/png"); // Convert to image URL
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode-framed.png"; // Set download filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-100 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Top-Up QR Code
        </h2>

        {/* QR Code with Frame */}
        <div
          ref={qrContainerRef}
          className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border-4 border-gray-300"
        >
          <p className="text-lg font-semibold text-gray-700 mb-3">Scan Me</p>
          <QRCodeCanvas value={qrValue} size={250} />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            onClick={downloadQRCode}
            className="px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg shadow-lg transform transition duration-300 hover:bg-green-700 hover:scale-105 focus:outline-none"
          >
            ⬇ Download QR Code
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
