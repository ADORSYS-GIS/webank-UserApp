import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, X } from "react-feather";

interface KYCReminderPopupProps {
  onClose: () => void;
}

const KYCReminderPopup: React.FC<KYCReminderPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleVerify = () => {
    onClose(); // Close the popup before navigation
    navigate("/kyc");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Lock className="text-blue-500" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            KYC Verification Required
          </h2>
          <p className="text-gray-600 text-center mb-6">
            To continue using our services, please complete your identity
            verification.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <X className="text-red-500" size={20} />
            <span className="text-gray-700">Access to advanced features</span>
          </div>
          <div className="flex items-center space-x-3">
            <X className="text-red-500" size={20} />
            <span className="text-gray-700">Higher transaction limits</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-blue-500" size={20} />
            <span className="text-gray-700">Basic account features</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleVerify}
            className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            Verify My Identity
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCReminderPopup;
