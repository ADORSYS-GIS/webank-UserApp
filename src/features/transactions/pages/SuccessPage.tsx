import { CheckCircle } from "lucide-react";
import { useSuccessPage } from "../hooks/useSuccessPage";

export default function SuccessPage() {
  const { amount, TransactionID, paymentTime, paymentMethod, handleReturnToDashboard } = useSuccessPage();
  const formattedPaymentTime = new Date(paymentTime).toLocaleString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full transition-all duration-300 hover:shadow-xl">
        <CheckCircle className="text-emerald-600 w-20 h-20 mx-auto mb-6 animate-bounce" />

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Payment Successful
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Your transaction has been processed successfully
        </p>

        <div className="w-full bg-gray-50 rounded-lg p-6 mb-8">
          <dl className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-gray-200">
              <dt className="text-gray-600 font-medium">Total Amount</dt>
              <dd className="text-emerald-700 font-semibold text-xl">
                XAF {amount}
              </dd>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-gray-200">
              <dt className="text-gray-600 font-medium">Transaction ID</dt>
              <dd className="text-gray-900 font-mono break-all whitespace-normal">
                {TransactionID}
              </dd>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-gray-200">
              <dt className="text-gray-600 font-medium">Payment Time</dt>
              <dd className="text-gray-900 break-all whitespace-normal">
                {formattedPaymentTime}
              </dd>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <dt className="text-gray-600 font-medium">Payment Method</dt>
              <dd className="text-gray-900 break-all whitespace-normal">
                {paymentMethod}
              </dd>
            </div>
          </dl>
        </div>

        <button
          onClick={handleReturnToDashboard}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-[1.02]"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
