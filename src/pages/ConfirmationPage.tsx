import { useLocation, useNavigate } from "react-router-dom";

const TransactionReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId, amount } = location.state || {};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Transaction Review
        </h2>
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
          <p className="text-gray-500 text-sm">Account ID</p>
          <p className="text-lg font-semibold text-gray-900 break-all">
            {accountId || "34sfzrgfkaliflids-rfnsrlfdrm"}
          </p>
        </div>
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
          <p className="text-gray-500 text-sm">Amount</p>
          <p className="text-lg font-semibold text-gray-900">
            {amount ? `${amount} XAF` : "5,000,000 XAF"}
          </p>
        </div>
        <div className="flex justify-between items-center mt-8">
          {/* Cancel Button */}
          <button
            className="px-6 py-3 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
          {/* Confirm Button */}
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => console.log("Transaction confirmed")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionReview;
