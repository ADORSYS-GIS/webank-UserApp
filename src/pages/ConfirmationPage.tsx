import { useLocation, useNavigate } from "react-router-dom";

const TransactionReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId, amount } = location.state || {};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Transaction Review
        </h2>

        <div className="mb-6 bg-gray-100 p-5 rounded-lg shadow-inner">
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            Account ID
          </p>
          <p className="text-xl font-semibold text-gray-800 break-all">
            {accountId || "34sfzrgfkaliflids-rfnsrlfdrm"}
          </p>
        </div>

        <div className="mb-6 bg-gray-100 p-5 rounded-lg shadow-inner">
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            Amount
          </p>
          <p className="text-xl font-semibold text-gray-800">
            {amount ? `${amount} XAF` : "5,000,000 XAF"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-10">
          {/* Cancel Button */}
          <button
            className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all focus:outline-none focus:ring-4 focus:ring-red-300 shadow-md"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all focus:outline-none focus:ring-4 focus:ring-green-300 shadow-md"
            onClick={() => navigate("/success")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionReview;
