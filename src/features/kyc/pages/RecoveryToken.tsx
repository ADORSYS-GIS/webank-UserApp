import React from "react";
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { toast } from "sonner";
import { ClipboardCopy } from "lucide-react";
import useDisableScroll from "@shared/hooks/useDisableScroll";

const RecoveryToken: React.FC = () => {
  useDisableScroll();
  const location = useRouterState().location;
  const navigate = useNavigate();
  const { recoveryToken } = location.state as { recoveryToken?: string };

  const handleCopy = async () => {
    if (!recoveryToken) {
      toast.error("No recovery token to copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(recoveryToken);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };

  const goToDashboard = () => {
    navigate({ to: '/account-recovery' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Account Recovery Token
          </h2>
          <p className="text-gray-600">
            Copy this token and send it to the client to recover their account
          </p>
        </div>

        {/* Token Display */}
        <div className="mb-8">
          <div className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
            <span className="text-gray-700 font-mono text-sm break-all flex-1">
              {recoveryToken}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              aria-label="Copy token"
            >
              <ClipboardCopy size={16} />
            </button>
          </div>
        </div>

        {/* Back to Recovery Dashboard */}
        <button
          onClick={goToDashboard}
          className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
        >
          Back to Recovery Dashboard
        </button>
      </div>
    </div>
  );
};

export default RecoveryToken;
