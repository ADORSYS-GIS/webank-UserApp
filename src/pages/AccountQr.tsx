import React, { useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";

interface AccountQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountQRModal: React.FC<AccountQRModalProps> = ({ isOpen, onClose }) => {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate QR Code content with predefined values
  const qrValue = JSON.stringify({
    accountId: accountId,
  });

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

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, onClose]);

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
              className="w-full py-3 text-gray-700 text-sm font-medium bg-gray-100 rounded-xl transition hover:bg-gray-200 active:scale-98 flex items-center justify-center"
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
