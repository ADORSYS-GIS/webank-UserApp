import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure transaction details from location.state
  const { totalPayment, TranactionID, paymentTime, paymentMethod } =
    location.state || {};

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
              <span className="font-bold text-gray-900 text-xl">
                {totalPayment || "XAF 5100"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-bold text-gray-900">
                {TranactionID || "000085752257"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Time</span>
              <span className="font-bold text-gray-900">
                {paymentTime || "25 Feb 2023, 13:22"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-bold text-gray-900">
                {paymentMethod || "Bank Transfer"}
              </span>
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
