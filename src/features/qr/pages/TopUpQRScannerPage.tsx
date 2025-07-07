// TopUpQRScannerPage.tsx - For Top Up QR codes only
// ... existing code from QRScannerPage.tsx ...

import * as React from "react";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import ConfirmationBottomSheet from "@features/transactions/pages/ConfirmationPage";
import SaveContactModal from "@shared/components/SaveContactModal";
import { useTopUpQRScanner } from "../hooks/useTopUpQRScanner";

const TopUpQRScannerPage: React.FC = () => {
  useDisableScroll();
  const {
    showConfirmation,
    confirmationData,
    handleConfirmationDismiss,
    error,
    handleFileUpload,
    navigate,
    isClientOffline,
    showSaveContact,
    scannedAccountId,
    scannedName,
    handleContactCancel,
    handleContactSave,
  } = useTopUpQRScanner();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isClientOffline ? "Scan Agent QR Code" : "Scan Client QR Code"}
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
          Upload QR Image{" "}
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

      {/* Save Contact Modal */}
      {showSaveContact && scannedAccountId && (
        <SaveContactModal
          isOpen={showSaveContact}
          onClose={handleContactCancel}
          accountId={scannedAccountId}
          defaultName={scannedName || ""}
          onSave={handleContactSave}
        />
      )}

      {/* Confirmation Bottom Sheet */}
      {showConfirmation && confirmationData && (
        <ConfirmationBottomSheet
          data={confirmationData}
          onDismiss={handleConfirmationDismiss}
        />
      )}
    </div>
  );
};

export default TopUpQRScannerPage;
