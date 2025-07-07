import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import { useQRGenerator } from "../hooks/useQRGenerator";

const QRGenerator: React.FC = () => {
  useDisableScroll();
  const {
    qrRef,
    qrValue,
    isClientOnline,
    isClientOffline,
    show,
    navigate,
    downloadQRCode,
  } = useQRGenerator();

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md md:max-w-lg flex flex-col items-center gap-6 mt-[-50px] md:mt-[-10px]">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          {isClientOnline ? "Top-Up QR Code" : "Withdraw QR Code"}
        </h2>

        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center w-[270px] h-[270px]">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300 flex items-center justify-center w-[250px] h-[250px]">
            <QRCodeCanvas value={qrValue} size={250} ref={qrRef} level="L" />
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-col items-center gap-3">
          <button
            onClick={downloadQRCode}
            className="w-full px-6 py-3 text-white bg-emerald-600 rounded-lg shadow-md transition hover:bg-emerald-700 active:scale-95"
          >
            Download QR
          </button>

          {show == "Pay out" && (
            <button
              onClick={() =>
                navigate("/qr-scan/top-up", { state: { isClientOffline } })
              }
              className="w-full px-6 py-3 text-white bg-amber-600 rounded-lg shadow-md transition hover:bg-amber-700 active:scale-95"
            >
              Scan Instead
            </button>
          )}

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

export default QRGenerator;
