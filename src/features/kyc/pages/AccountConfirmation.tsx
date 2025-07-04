import React, { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import { RequestToGetRecoveryToken } from "@services/keyManagement/requestService";

interface AccountConfirmationState {
  accountId: string;
  oldAccountId: string;
}

const AccountConfirmation: React.FC = () => {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useRouterState().location;
  const state = location.state as unknown as AccountConfirmationState;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get account certificate from Redux store
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  // Extract state values
  const newAccountId = state?.accountId;
  const oldAccountId = state?.oldAccountId;

  // Handle confirmation with API call
  const handleConfirm = async () => {
    if (!newAccountId || !oldAccountId) {
      toast.error(
        "Missing account details. Please try the scanning process again.",
      );
      window.history.back();
    }

    setIsSubmitting(true);
    try {
      // Get recovery token from API
      const recoveryToken = await RequestToGetRecoveryToken(
        oldAccountId,
        newAccountId,
        accountCert,
      );

      // Navigate with the recovery token
      navigate({
        to: "/recovery/recoverytoken",
        state: {
          oldAccountId,
          newAccountId,
          recoveryToken,
        } as never,
      });
    } catch (error) {
      toast.error("Failed to get recovery token. Please try again.");
      console.error("Recovery token error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onClick={() => window.history.back()}
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
