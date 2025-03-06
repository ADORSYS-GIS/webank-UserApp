import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";
import useDisableScroll from "../hooks/useDisableScroll";

const AgentPage: React.FC = () => {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const { agentAccountId, agentAccountCert } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Agent Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          {/* Cash-In Button */}
          <div className="relative flex flex-col items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <FontAwesomeIcon icon={faQrcode} className="text-5xl mb-3" />
            <button
              className="text-xl font-semibold bg-white text-purple-600 px-4 py-2 rounded-lg mt-3 shadow-md hover:bg-gray-200 transition"
              onClick={() =>
                navigate("/qr-scan", {
                  state: { agentAccountId, agentAccountCert, show: "Top up" },
                })
              }
            >
              Cash-In
            </button>
            <p className="text-sm opacity-90 mt-2">
              Scan QR code to receive payments
            </p>
          </div>

          {/* Withdraw Button */}
          <div className="relative flex flex-col items-center bg-gradient-to-r from-blue-400 to-purple-400 text-white p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <FontAwesomeIcon icon={faMoneyCheckAlt} className="text-5xl mb-3" />
            <button
              className="text-xl font-semibold bg-white text-blue-600 px-4 py-2 rounded-lg mt-3 shadow-md hover:bg-gray-200 transition"
              onClick={() =>
                navigate("/top-up", {
                  state: { show: "Pay out", agentAccountId, agentAccountCert },
                })
              }
            >
              Pay-out
            </button>
            <p className="text-sm opacity-90 mt-2">Payout cash to customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
