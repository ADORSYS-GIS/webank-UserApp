import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast } from "sonner";
import {
  setAccountCert,
  setAccountId,
  setKycCert,
} from "../../slices/accountSlice.ts";
import {
  RequestToSubmitRecoveryToken,
  RequestToRecoverAccountCert,
} from "../../services/keyManagement/requestService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faIdCard,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const RecoverAccountPage: React.FC = () => {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const dispatch = useDispatch();
  const supportPhoneNumber = "+237654066316";
  let data = "";
  let oldAccountId = "";
  let kycCert = "";

  const handleKYCRecovery = () => {
    const accountIdText = accountId ? `Account ID: ${accountId}\n\n` : "";
    const customMessage = encodeURIComponent(
      `Welcome to KYC Recovery!\n\n` + accountIdText + `My name is : `,
    );
    const whatsappLink = `https://api.whatsapp.com/send?phone=${supportPhoneNumber}&text=${customMessage}`;
    window.open(whatsappLink, "_blank");
  };

  const handleTokenSubmit = async () => {
    try {
      if (!accountId || !accountCert) {
        toast.error("Account information is missing.");
        return;
      }
      data = await RequestToSubmitRecoveryToken(accountId, token, accountCert);
      console.log(data, "response");
      oldAccountId = data.split(" ")[0];
      kycCert = data.split(" ")[1];

      const isInvalidToken = (value: string | null | undefined): boolean =>
        value === "null" || !value;

      if (isInvalidToken(oldAccountId) || isInvalidToken(kycCert)) {
        toast.error("Invalid token. Please try again.");
        return;
      }

      localStorage.setItem("accountId", oldAccountId);
      localStorage.setItem("kycCert", kycCert);
      dispatch(setKycCert(kycCert));
      dispatch(setAccountId(oldAccountId));

      if (data) {
        setShowTokenInput(false);
        setShowConfirmation(true);
      } else {
        toast.error("Invalid token. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting token:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleYesClick = async () => {
    try {
      if (!accountId) {
        toast.error("Account information is missing.");
        return;
      }

      const certResponse = await RequestToRecoverAccountCert(accountId);
      if (certResponse) {
        localStorage.setItem("accountCert", certResponse);
        dispatch(setAccountCert(certResponse));
        toast.success("Account recovery successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Failed to recover account certificate. Please try again.");
      }
    } catch (error) {
      console.error("Error recovering account certificate:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go Back"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="h-5 w-5 text-gray-600"
            />
          </button>
          <h1 className="text-xl font-semibold mx-auto pr-10">
            Account Recovery
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faKey} className="text-blue-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold mb-2">Recover Your Account</h2>
          <p className="text-gray-600 text-sm">
            Choose one of the options below to recover your account access
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleKYCRecovery}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center hover:border-blue-500 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faIdCard} className="text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Initiate KYC Recovery</h3>
              <p className="text-sm text-gray-600">
                Contact support through WhatsApp
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowTokenInput(true)}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center hover:border-blue-500 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faKey} className="text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Input Recovery Token</h3>
              <p className="text-sm text-gray-600">
                Enter the token sent to you
              </p>
            </div>
          </button>
        </div>
      </main>

      {/* Token Input Bottom Sheet */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-end justify-end transition-opacity duration-300">
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
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
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
      )}

      {/* Confirmation Bottom Sheet */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-end justify-end transition-opacity duration-300">
          <div className="w-full bg-white rounded-t-2xl p-6 shadow-lg z-50 transform transition-transform duration-300 animate-slide-up">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-blue-500 text-2xl"
                />
              </div>
              <h2 className="text-xl font-bold">Confirm Recovery</h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to recover this account?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleYesClick}
                className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoverAccountPage;
