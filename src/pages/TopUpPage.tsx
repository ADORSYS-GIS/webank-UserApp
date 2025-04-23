import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateTransactionFee } from "../services/computation/transactionFeeCalculator";
import useDisableScroll from "../hooks/useDisableScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const TopUpPage: React.FC = () => {
  useDisableScroll();
  const [amount, setAmount] = useState<number | string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const clientAccountId = location.state?.clientAccountId;
  const show = location.state?.show;
  const isClientOffline = location.state?.isClientOffline;
  const isClientOnline = location.state?.isClientOnline;
  const agentAccountCert = location.state?.agentAccountCert;
  const agentAccountId = location.state?.agentAccountId;

  // Calculate the total amount (top-up amount + transaction fee)
  const totalAmount = Number(amount) + calculateTransactionFee(Number(amount));

  const handleCancel = () => {
    navigate("/dashboard", {
      state: { accountId: clientAccountId },
    }); // Go back to the previous page
  };

  const handleContinue = () => {
    const numericAmount = Number(amount);
    if (numericAmount <= 0) {
      alert("Please enter a valid top-up amount.");
      return;
    }

    if (numericAmount > 500000) {
      alert("The maximum amount for a single transfer is 500,000 XAF.");
      return;
    }

    if (show === "Transfer" || show === "Payment") {
      navigate("/confirmation", {
        state: {
          amount: totalAmount,
          clientAccountId,
          agentAccountId,
          agentAccountCert,
          show,
        },
      });
    } else {
      navigate("/qrcode", {
        state: {
          totalAmount,
          accountId: clientAccountId,
          isClientOffline,
          isClientOnline,
          show,
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div className="text-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800">{show}</h1>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Enter {show} Amount (XAF)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction Fee:</span>
              <span className="font-medium text-gray-800">
                {calculateTransactionFee(Number(amount))} XAF
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-gray-800">{totalAmount} XAF</span>
            </div>
          </div>

          <div className="flex justify-between gap-3 mt-2">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-red-100 rounded-lg text-gray-800 font-medium hover:bg-gray-200 transition duration-300 flex items-center justify-center flex-1"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 font-medium flex items-center justify-center flex-1"
            >
              Continue
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;