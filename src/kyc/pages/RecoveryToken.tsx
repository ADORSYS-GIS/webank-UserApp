import React from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ClipboardCopy } from "lucide-react";
import useDisableScroll from "../../hooks/useDisableScroll";

const RecoveryToken: React.FC = () => {
  useDisableScroll();
  const location = useLocation();
  const recoveryToken = location.state?.recoveryToken || "N/A";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryToken);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Account Recovery Token
        </h2>

        {/* Token Display */}
        <div className="relative bg-gray-100 p-4 rounded-lg border border-gray-300 flex justify-between items-center">
          <span className="text-gray-700 font-mono text-lg truncate">
            {recoveryToken}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ClipboardCopy size={20} />
          </button>
        </div>

        {/* Toast Notification */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default RecoveryToken;
