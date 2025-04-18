import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {
  RequestToSubmitRecoveryToken,
  RequestToRecoverAccountCert,
} from "../../services/keyManagement/requestService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import {
  setAccountCert,
  setAccountId,
  setKycCert,
} from "../../slices/accountSlice.ts";

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
        setShowConfirmation(true);
      } else {
        alert("Invalid token. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting token:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleYesClick = async () => {
    console.log(accountId, "oldAccountId");
    try {
      console.log(accountId, "oldAccountId2");

      if (!accountId) {
        toast.error("Account information is missing.");
        return;
      }

      const certResponse = await RequestToRecoverAccountCert(accountId);
      console.log(certResponse, "response");
      if (certResponse) {
        localStorage.setItem("accountCert", certResponse);
        console.log(certResponse, "certResponse");
        dispatch(setAccountCert(certResponse));
        alert("Account recovery successful. Redirecting to your dashboard...");
        navigate("/dashboard");
      } else {
        alert("Failed to recover account certificate. Please try again.");
      }
    } catch (error) {
      console.error("Error recovering account certificate:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCloseOverlay = () => {
    setShowTokenInput(false);
    setShowConfirmation(false);
    setToken("");
  };

  const handleCancel = () => {
    navigate("/post-registration");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleCancel}
        >
          <FaTimes size={20} />
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">Recover Account</h1>
        <button
          onClick={handleKYCRecovery}
          className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200 mb-4"
        >
          Initiate KYC Recovery
        </button>
        <button
          onClick={() => setShowTokenInput(true)}
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition duration-200 mb-4"
        >
          Input Recovery Token
        </button>
      </div>
      {showTokenInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <button
            className="absolute inset-0 w-full h-full bg-transparent cursor-default"
            onClick={handleCloseOverlay}
            aria-label="Close token input overlay"
          />
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative z-10">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseOverlay}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">
              Enter Recovery Token
            </h2>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Recovery Token"
            />
            <button
              onClick={handleTokenSubmit}
              className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <button
            className="absolute inset-0 w-full h-full bg-transparent cursor-default"
            onClick={handleCloseOverlay}
            aria-label="Close confirmation overlay"
          />
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative z-10">
            <h2 className="text-xl font-bold mb-4 text-center">
              Are you sure you want to proceed?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleYesClick}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-600 transition duration-200"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-600 transition duration-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RecoverAccountPage;
