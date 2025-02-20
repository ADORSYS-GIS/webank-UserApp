import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";
import useDisableScroll from "../hooks/useDisableScroll";

const QRGenerator: React.FC = () => {
  useDisableScroll();
  const location = useLocation();
  const totalamount = location.state?.totalAmount;
  const accountId = location.state?.accountId;

  // Generate QR Code content with predefined values
  const qrValue = JSON.stringify({
    accountId: accountId,
    amount: totalamount,
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-100 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Top-Up QR Code
        </h2>

        {/* QR Code Display */}
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg mb-8">
          <QRCodeCanvas value={qrValue} size={250} />
        </div>

        {/* Back Button */}
        <div className="mt-6 flex justify-center">
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
