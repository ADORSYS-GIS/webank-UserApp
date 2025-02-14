import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopUpPage: React.FC = () => {
  const [amount, setAmount] = useState<number | string>("");
  const navigate = useNavigate();

  // Function to calculate the transaction fee based on the amount
  const calculateTransactionFee = (amount: number) => {
    if (amount <= 5000) {
      return 0; // 0 XAF fee for amounts <= 5000 XAF
    } else if (amount > 5000 && amount <= 500000) {
      return 1000; // 1000 XAF fee for amounts between 5001 XAF and 500000 XAF
    } else {
      return 1000; // Default fee for amounts > 500000 XAF (not allowed)
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
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
    navigate(`/qr-code?amount=${numericAmount}`);
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
