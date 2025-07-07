import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAccountQRModal } from "../hooks/useAccountQRModal";

interface AccountQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountQRModal: React.FC<AccountQRModalProps> = ({ isOpen, onClose }) => {
  const {
    qrRef,
    modalRef,
    includeName,
    setIncludeName,
    name,
    setName,
    qrValue,
    downloadQRCode,
  } = useAccountQRModal(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60 animate-fadeIn">
      <div
        className={`bg-white rounded-t-2xl w-full max-w-md mx-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "85vh", overflowY: "auto" }}
        ref={modalRef}
      >
        {/* Pull indicator for mobile */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
        </div>

        <div className="px-6 pt-4 pb-8 md:px-8 flex flex-col items-center">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your QR Code
          </h2>

          {/* Name Input Section */}
          <div className="w-full mb-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="includeName"
                checked={includeName}
                onChange={(e) => setIncludeName(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeName" className="text-gray-700">
                Include my name in QR code
              </label>
            </div>
            {includeName && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* QR Code Frame - Improved styling */}
          <div className="mb-8 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
            <div className="p-3 bg-white rounded-xl flex items-center justify-center">
              <QRCodeCanvas
                value={qrValue || "No Account ID"}
                size={230}
                ref={qrRef}
                level="L"
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>
          </div>

          {/* Buttons - More elegant styling */}
          <div className="w-full space-y-3 mt-2">
            <button
              onClick={downloadQRCode}
              className="w-full py-3 text-white text-sm font-medium bg-blue-500 rounded-xl shadow-sm transition hover:bg-blue-600 active:scale-98 flex items-center justify-center"
            >
              Download QR Code
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-700 text-sm font-medium bg-gray-300 rounded-xl transition hover:bg-gray-200 active:scale-98 flex items-center justify-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountQRModal;
