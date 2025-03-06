import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import useDisableScroll from "../hooks/useDisableScroll";

const AccountQR: React.FC = () => {
  useDisableScroll();
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const qrRef = useRef<HTMLCanvasElement>(null);
  // Function to download QR code
  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "account_qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Generate QR Code content with predefined values
  const qrValue = JSON.stringify({
    accountId: accountId,
  });

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md md:max-w-lg flex flex-col items-center gap-6 mt-[-50px] md:mt-[-10px]">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Account QR
        </h2>

        {/* QR Code Frame */}
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center w-[270px] h-[270px]">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300 flex items-center justify-center w-[250px] h-[250px]">
            <QRCodeCanvas
              value={qrValue || "No Account ID"}
              size={250}
              ref={qrRef}
              level="L"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col md:flex-col items-center gap-3">
          <button
            onClick={downloadQRCode}
            className="w-full px-6 py-3 text-white bg-emerald-600 rounded-lg shadow-md transition hover:bg-emerald-700 active:scale-95"
          >
            Download QR
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md transition hover:bg-blue-700 active:scale-95"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};
export default AccountQR;
