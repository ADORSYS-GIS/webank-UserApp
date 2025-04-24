import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateTransactionFee } from "../services/computation/transactionFeeCalculator";
import useDisableScroll from "../hooks/useDisableScroll";
import { RootState } from "../store/Store";
import { useSelector } from "react-redux";
import { toast } from "sonner";

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
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);

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
      toast.info("Please enter a valid amount.");
      return;
    }

    if (numericAmount > 1000 && kycCert == null && status !== "APPROVED") {
      toast.info("KYC is required for transfers over 1000 XAF.");
      return;
    }

    if (numericAmount > 500000) {
      toast.info("Maximum top-up amount is 500,000 XAF.");
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
              type="text" // not "number"
              inputMode="numeric"
              pattern="[0-9]*"
              id="amount"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
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
              <span className="font-medium text-gray-800">
                {totalAmount} XAF
              </span>
            </div>
          </div>

          <div className="flex justify-between gap-3 mt-2">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 rounded-lg text-gray-800 font-medium transition duration-300 flex items-center justify-center flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 font-medium flex items-center justify-center flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;
