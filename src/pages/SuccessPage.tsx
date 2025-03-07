import { CheckCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

interface TransactionDetails {
  amount: number;
  TransactionID: string;
  paymentTime: number;
  paymentMethod: string;
}

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionCert } = location.state || {};

  let transactionDetails: TransactionDetails = {
    amount: 0,
    TransactionID: "N/A",
    paymentTime: 0,
    paymentMethod: "N/A",
  };

  if (transactionCert) {
    try {
      const decoded = jwtDecode<TransactionDetails>(transactionCert);
      transactionDetails = decoded;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }

  const { amount, TransactionID, paymentTime, paymentMethod } = transactionDetails;
  const formattedPaymentTime = new Date(paymentTime).toLocaleString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-2 rounded-xl shadow-lg max-w-md w-full transition-all duration-300 hover:shadow-xl">
          <CheckCircle className="text-green-600 w-32 h-32 mx-auto mb-6 transform transition-transform animate-bounce text-emerald-600 w-20 h-20 mb-6 animate-scale-in" />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Payment Successful
          </h1>
          
          <p className="text-gray-600 text-center mb-8">
            Your transaction has been processed successfully
          </p>

          <div className="w-full bg-gray-50 rounded-lg p-6 mb-8">
            <dl className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <dt className="text-gray-600 font-medium">Total Amount</dt>
                <dd className="text-emerald-700 font-semibold text-xl">
                  ${amount.toFixed(2)}
                </dd>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <dt className="text-gray-600 font-medium">Transaction ID</dt>
                <dd className="text-gray-900 font-mono">{TransactionID}</dd>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <dt className="text-gray-600 font-medium">Payment Time</dt>
                <dd className="text-gray-900">{formattedPaymentTime}</dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-600 font-medium">Payment Method</dt>
                <dd className="text-gray-900">{paymentMethod}</dd>
              </div>
            </dl>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-[1.02]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
  );
}

