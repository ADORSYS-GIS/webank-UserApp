import { useLocation, useNavigate } from "react-router-dom";

const TransactionReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId, amount } = location.state || {};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Transaction Review
        </h2>
        <div className="mb-6">
          <p className="text-gray-600">Account ID:</p>
          <p className="text-lg font-semibold">
            {accountId || "34sfzrgfkaliflids-rfnsrlfdrm"}
          </p>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">Amount:</p>
          <p className="text-lg font-semibold">{amount || "5000,000"}</p>
        </div>
        <div className="flex justify-between mt-8">
          {/* Cancel Button */}
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
            onClick={() => navigate("/scan")}
          >
            Cancel
          </button>
          {/* Confirm Button */}
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all"
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
