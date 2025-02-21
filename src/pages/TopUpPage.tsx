import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateTransactionFee } from "../services/computation/transactionFeeCalculator";
import useDisableScroll from "../hooks/useDisableScroll";

const TopUpPage: React.FC = () => {
  useDisableScroll();
  const [amount, setAmount] = useState<number | string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const clientAccountId = location.state?.clientAccountId;
  const clientAccountCert = location.state?.clientAccountCert;

  // Calculate the total amount (top-up amount + transaction fee)
  const totalAmount = Number(amount) + calculateTransactionFee(Number(amount));

  const handleCancel = () => {
    navigate("/dashboard", {
      state: { accountId: clientAccountId, accountCert: clientAccountCert },
    }); // Go back to the previous page
  };

  const handleContinue = () => {
    const numericAmount = Number(amount);

    // Validate the amount
    if (numericAmount <= 0) {
      alert("Please enter a valid top-up amount.");
      return;
    }

    if (numericAmount > 500000) {
      alert("The maximum amount for a single transfer is 500,000 XAF.");
      return;
    }

    // Navigate to the QR code page with the amount
    navigate("/qrcode", { state: { totalAmount, accountId: clientAccountId } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Top-up</h1>
        {/* Text with blue to purple gradient */}
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2"
        >
          Enter Top-up Amount
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-4 text-sm text-gray-600">
          Transaction Fee: {calculateTransactionFee(Number(amount))} XAF
        </p>
        {/* Display Total Amount */}
        <p className="mt-2 text-sm text-gray-600">
          Total Amount: {totalAmount} XAF
        </p>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
          {/* Button with blue to purple gradient */}
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;
