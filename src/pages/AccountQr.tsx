import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import useDisableScroll from "../hooks/useDisableScroll";

const AccountQR: React.FC = () => {
  useDisableScroll();
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const qrRef = useRef<HTMLCanvasElement>(null);

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

  const qrValue = JSON.stringify({
    accountId: accountId,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => window.history.back()} />
      
      {/* Bottom Sheet (Mobile) / Modal (Desktop) */}
      <div className="relative z-10 w-full max-w-md md:rounded-2xl bg-white shadow-xl md:max-w-lg transition-transform duration-300">
        <div className="p-6 md:p-8 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Account QR</h2>
          
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 w-[270px] h-[270px]">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300 w-[250px] h-[250px]">
              <QRCodeCanvas
                value={qrValue || "No Account ID"}
                size={250}
                ref={qrRef}
                level="L"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={downloadQRCode}
              className="w-full px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Download QR
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors md:hidden"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountQR;