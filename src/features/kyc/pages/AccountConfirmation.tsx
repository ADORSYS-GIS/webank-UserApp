import React from "react";
import { useAccountConfirmation } from "../hooks/useAccountConfirmation";

const AccountConfirmation: React.FC = () => {
  const {
    isSubmitting,
    handleConfirm,
    navigate,
    newAccountId,
    oldAccountId,
  } = useAccountConfirmation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Account Recovery Confirmation
        </h2>

        {/* Account Information Display */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <div className="text-left">
            <span className="font-medium text-gray-600">Old Account ID:</span>
            <p className="text-gray-800 break-all mt-1">
              {oldAccountId ?? "Not available"}
            </p>
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-600">New Account ID:</span>
            <p className="text-gray-800 break-all mt-1">
              {newAccountId ?? "Not available"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors shadow-md
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSubmitting ? "Processing..." : "Confirm Recovery"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg
                     hover:bg-gray-300 transition-colors shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountConfirmation;
