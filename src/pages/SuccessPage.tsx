import { CheckCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

// Define the type of the decoded JWT payload
interface TransactionDetails {
  amount: number;
  TranactionID: string;
  paymentTime: number;
  paymentMethod: string;
}

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionCert } = location.state || {};

  // Define transaction details object with proper types
  let transactionDetails: TransactionDetails = {
    amount: 0,
    TranactionID: "N/A",
    paymentTime: 0,
    paymentMethod: "N/A",
  };

  if (transactionCert) {
    try {
      const decoded = jwtDecode<TransactionDetails>(transactionCert); // Decode the JWT and infer the type
      transactionDetails = decoded; // Set the decoded transaction details
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }

  const { amount, TranactionID, paymentTime, paymentMethod } =
    transactionDetails;

  // Format payment time to a readable string
  const formattedPaymentTime = new Date(paymentTime).toLocaleString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full">
        <CheckCircle className="text-green-600 w-32 h-32 mx-auto mb-6 transform transition-transform animate-bounce" />

        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-widest">
          Payment Success!
        </h1>

        <p className="text-gray-700 mt-4 text-lg leading-relaxed">
          Your payment has been successfully done
        </p>

        <div className="mt-8 space-y-6">
          {/* Transaction Details */}
          <div className="space-y-4 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Payment</span>
              <span className="font-bold text-gray-900 text-xl">{amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-bold text-gray-900">{TranactionID}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Time</span>
              <span className="font-bold text-gray-900">
                {formattedPaymentTime}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-bold text-gray-900">{paymentMethod}</span>
            </div>
          </div>

          {/* Return Button */}
          <button
            className="mt-8 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-3xl text-2xl shadow-lg transform transition-transform hover:scale-105"
            onClick={() => navigate("/dashboard")}
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
