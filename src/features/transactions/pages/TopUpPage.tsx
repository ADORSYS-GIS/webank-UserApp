import React from "react";
import { calculateTransactionFee } from "@services/computation/transactionFeeCalculator";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import ConfirmationBottomSheet from "../pages/ConfirmationPage";
import { useTopUpPage } from "../hooks/useTopUpPage";

const TopUpPage: React.FC = () => {
  useDisableScroll();
  const {
    amount,
    setAmount,
    showConfirmation,
    handleContinue,
    handleCancel,
    handleConfirmationDismiss,
    clientAccountId,
    show,
    agentAccountCert,
    agentAccountId,
  } = useTopUpPage();

  const totalAmount = Number(amount) + calculateTransactionFee(Number(amount));

  const confirmationData = {
    amount: totalAmount,
    clientAccountId: clientAccountId || "",
    agentAccountId: agentAccountId || "",
    agentAccountCert: agentAccountCert || "",
    show: show || "",
    clientName: "Anonymous", // Optionally pass clientName from state if needed
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

      {/* Conditionally render the confirmation bottom sheet */}
      {showConfirmation && (
        <ConfirmationBottomSheet
          data={confirmationData}
          onDismiss={handleConfirmationDismiss}
        />
      )}
    </div>
  );
};

export default TopUpPage;
