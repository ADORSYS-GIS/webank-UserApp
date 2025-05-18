import React from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

interface KycRejectionPopupProps {
  reason: string;
  onClose: () => void;
}

const KycRejectionPopup: React.FC<KycRejectionPopupProps> = ({
  reason,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    onClose();
    navigate("/kyc");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 flex flex-col items-center relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col items-center mb-4">
          <div className="bg-red-100 rounded-full p-4 mb-3">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-500 text-3xl"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Verification Failed
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Your identity verification was{" "}
            <span className="font-semibold text-red-500">rejected</span>.
          </p>
        </div>
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-center">
          <span className="font-semibold">Reason:</span> {reason}
        </div>
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors text-lg shadow"
          >
            Cancel
          </button>
          <button
            onClick={handleRetry}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-lg shadow"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycRejectionPopup;
