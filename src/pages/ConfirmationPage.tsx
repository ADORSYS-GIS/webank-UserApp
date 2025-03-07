import { useLocation, useNavigate } from "react-router-dom";
import {
  RequestToTopup,
  RequestToWithdrawOffline,
} from "../services/keyManagement/requestService";
import { toast, ToastContainer } from "react-toastify";
import useDisableScroll from "../hooks/useDisableScroll";

const ConfirmationPage: React.FC = () => {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if state exists; if not, redirect to top-up page
  if (!location.state) {
    console.error("No state provided. Redirecting to top-up page.");
    navigate("/top-up");
    return null;
  }

  // Destructure the state values
  const {
    clientAccountId,
    amount,
    agentAccountId,
    agentAccountCert,
    transactionJwt,
    show,
  } = location.state;

  // Debug log for troubleshooting
  console.log("ConfirmationPage state:", location.state);

  const handleTopUp = async () => {
    // Offline handling based on show type
    if (
      !navigator.onLine &&
      show !== "Transfer" &&
      show !== "Payment" &&
      show !== "Top up"
    ) {
      toast.info("Oops, you are offline. Redirecting to the amount page...");
      setTimeout(() => {
        navigate("/top-up", {
          state: {
            clientAccountId,
            amount,
            isClientOffline: true,
          },
        });
      }, 4000);
      return;
    } else if (!navigator.onLine && show === "Transfer") {
      toast.error("Cannot transfer offline. Redirecting you to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
      return;
    } else if (!navigator.onLine && show === "Top up") {
      toast.error("Cannot top up offline. Redirecting you to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
      return;
    } else if (!navigator.onLine && show === "Payment") {
      toast.error("Cannot do payment offline. Redirecting you to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
      return;
    } else {
      try {
        const response = await RequestToTopup(
          clientAccountId,
          amount,
          agentAccountId,
          agentAccountCert,
        );
        if (response?.includes("Success")) {
          const transactionCert = response.replace(" Success", "");
          toast.success("Account successfully topped up.");
          navigate("/success", {
            state: {
              transactionCert,
              accountId: agentAccountId,
              accountCert: agentAccountCert,
            },
          });
        } else if (response?.includes("Insufficient")) {
          toast.error("Insufficient funds. Please add funds to your account.");
        }
      } catch (error) {
        toast.error("An error occurred while processing the transaction");
        console.error(error);
      }
    }
  };

  const handleOfflineWithdrawal = async () => {
    try {
      const response = await RequestToWithdrawOffline(
        clientAccountId,
        amount,
        agentAccountId,
        agentAccountCert,
        transactionJwt,
      );
      if (response?.includes("Success")) {
        const transactionCert = response.replace(" Success", "");
        toast.success("Account successfully topped up.");
        navigate("/success", {
          state: {
            transactionCert,
            accountId: agentAccountId,
            accountCert: agentAccountCert,
          },
        });
      } else if (response?.includes("Insufficient")) {
        toast.error(
          "Insufficient funds. Please ask the client to add funds to his account.",
        );
      }
    } catch (error) {
      toast.error("An error occurred while processing the transaction");
      console.error(error);
    }
  };

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
            {clientAccountId || "Default Account ID"}
          </p>
        </div>

        <div className="mb-6 bg-gray-100 p-5 rounded-lg shadow-inner">
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            Amount
          </p>
          <p className="text-xl font-semibold text-gray-800">
            {amount ? `${amount} XAF` : "Default Amount"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-10">
          <button
            className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all focus:outline-none focus:ring-4 focus:ring-red-300 shadow-md"
            onClick={() =>
              navigate("/dashboard", {
                state: {
                  accountId: agentAccountId,
                  accountCert: agentAccountCert,
                },
              })
            }
          >
            Cancel
          </button>

          <button
            className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all focus:outline-none focus:ring-4 focus:ring-green-300 shadow-md"
            onClick={transactionJwt ? handleOfflineWithdrawal : handleTopUp}
          >
            Confirm
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConfirmationPage;
