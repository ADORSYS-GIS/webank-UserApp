import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateTransactionFee } from "../services/computation/transactionFeeCalculator";
import useDisableScroll from "../hooks/useDisableScroll";
import { RootState } from "../store/Store";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

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

    if (numericAmount > 10000 && kycCert == null && status !== "APPROVED") {
      toast.info("KYC is required for transfers over 10,000 XAF.");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 h-screen">
      {" "}
      {/* Changed to fixed height */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto overflow-auto">
        {" "}
        {/* Added overflow */}
        {/* Scrollable content container */}
        <div className="flex flex-col gap-4 h-full">
          {" "}
          {/* Added flex container */}
          <h1 className="text-2xl font-bold text-center">{show}</h1>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Enter {show} Amount
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            inputMode="numeric"
            autoComplete="off"
            autoFocus // Helps with mobile keyboard management
          />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Transaction Fee: {calculateTransactionFee(Number(amount))} XAF
            </p>
            <p className="text-sm text-gray-600">
              Total Amount: {totalAmount} XAF
            </p>
          </div>
          {/* Buttons container with top margin */}
          <div className="flex justify-between gap-4 mt-4 pb-4">
            {" "}
            {/* Added padding bottom */}
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600 transition duration-300 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default TopUpPage;
