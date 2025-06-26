import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setAccountCert } from "../../slices/accountSlice";
import { RequestToRecoverAccountCert } from "../../services/keyManagement/requestService";
import { Key, CreditCard, ArrowLeft } from "react-feather";

const RecoverAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState("");

  const handleTokenSubmit = async () => {
    try {
      // Validate token input
      if (!recoveryToken.trim()) {
        toast.error("Please enter a valid recovery token.");
        return;
      }

      // Call the API to submit the recovery token
      const certResponse = await RequestToRecoverAccountCert(recoveryToken);
      if (certResponse) {
        localStorage.setItem("accountCert", certResponse);
        dispatch(setAccountCert(certResponse));
        toast.success("Account recovered successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid recovery token.");
      }
    } catch (error) {
      console.error("Error submitting token:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setShowTokenInput(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go Back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" size={20} />
          </button>
          <h1 className="text-xl font-semibold mx-auto pr-10">
            Account Recovery
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="text-blue-500 text-2xl" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Recover Your Account
          </h2>
          <p className="text-gray-600">
            Enter your recovery token to recover your account
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="text-blue-500" size={20} />
            <span className="text-gray-700">Enter your recovery token</span>
          </div>
          {/* Add buttons for test compatibility */}
          <button
            onClick={() => {
              window.open(
                "https://api.whatsapp.com/send?phone=+237659143005&text=I%20want%20to%20initiate%20KYC%20recovery",
                "_blank",
              );
            }}
            className="w-full mt-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            Initiate KYC Recovery
          </button>
          <button
            onClick={() => setShowTokenInput(true)}
            className="w-full mt-2 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Input Recovery Token
          </button>
        </div>
      </main>

      {/* Token Input Bottom Sheet */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-end justify-end transition-opacity duration-300">
          <div className="w-full md:max-w-[650px] md:mx-auto">
            <div className="w-full bg-white rounded-t-2xl p-6 shadow-lg z-50 transform transition-transform duration-300 animate-slide-up">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Enter Recovery Token</h2>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={recoveryToken}
                    onChange={(e) => setRecoveryToken(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Recovery Token"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowTokenInput(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTokenSubmit}
                    className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoverAccountPage;
