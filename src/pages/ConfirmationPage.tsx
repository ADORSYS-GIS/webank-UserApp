import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RequestToTopup,
  RequestToWithdrawOffline,
} from "../services/keyManagement/requestService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimes,
  faCoins,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { logEvent } from "../utils/analytics";

interface ConfirmationData {
  clientAccountId: string;
  amount: number;
  agentAccountId: string;
  agentAccountCert: string;
  transactionJwt?: string;
  show: string;
  clientName: string;
}

interface ConfirmationBottomSheetProps {
  data: ConfirmationData;
  onDismiss: () => void;
}

const ConfirmationBottomSheet: React.FC<ConfirmationBottomSheetProps> = ({
  data,
  onDismiss,
}) => {
  const {
    clientAccountId,
    amount,
    agentAccountId,
    agentAccountCert,
    transactionJwt,
    show,
    clientName,
  } = data;

  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const accountCert = useSelector((state: RootState) => state.account.accountCert);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);

  // Make sure data has a clientName property even if it wasn't passed
  const safeData = {
    ...data,
    clientName: data.clientName || "Anonymous",
  };

  const {
    clientAccountId: safeClientAccountId,
    amount: safeAmount,
    agentAccountId: safeAgentAccountId,
    agentAccountCert: safeAgentAccountCert,
    transactionJwt: safeTransactionJwt,
    show: safeShow,
    clientName: safeClientName,
  } = safeData;

  console.log("Confirmation Page Data:", safeData);
  console.log("Client Name in Confirmation:", safeClientName);

  useEffect(() => {
    // Animate the bottom sheet entry
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTopUp = async () => {
    // Offline handling based on show type
    if (
      !navigator.onLine &&
      safeShow !== "Transfer" &&
      safeShow !== "Payment" &&
      safeShow !== "Top up"
    ) {
      toast.info("Oops, you are offline. Redirecting to the amount page...");
      setTimeout(() => {
        navigate("/top-up", {
          state: {
            clientAccountId: safeClientAccountId,
            amount: safeAmount,
            isClientOffline: true,
            clientName: safeClientName, // Pass the client name in navigation
          },
        });
      }, 4000);
    } else if (!navigator.onLine && safeShow === "Transfer") {
      toast.error("Cannot transfer offline. Redirecting you to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
    } else if (!navigator.onLine && safeShow === "Top up") {
      toast.error("Cannot top up offline. Redirecting you to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
    } else if (!navigator.onLine && safeShow === "Payment") {
      toast.error("Cannot do payment offline. Redirecting you to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
    } else {
      try {
        const response = await RequestToTopup(
          safeClientAccountId,
          safeAmount,
          safeAgentAccountId,
          accountCert,
          kycCert,
        );
        if (response?.includes("Success")) {
          const transactionCert = response.replace(" Success", "");
          toast.success("Account successfully topped up.");
          // Log successful purchase
          await logEvent('purchase', { 
            transaction_id: transactionCert,
            currency: 'XAF',
            value: safeAmount
          });
          navigate("/success", {
            state: {
              transactionCert,
              accountId: safeAgentAccountId,
              accountCert: safeAgentAccountCert,
              clientName: safeClientName, // Include client name in success state
            },
          });
        } else if (response?.includes("Insufficient")) {
          toast.error("Insufficient funds. Please add funds to your account.");
          // Log transaction failure
          await logEvent('transaction_failed', { 
            flow: 'top_up',
            error_code: 'insufficient_funds'
          });
        }
      } catch (error) {
        toast.error("An error occurred while processing the transaction");
        // Log transaction failure
        await logEvent('transaction_failed', { 
          flow: 'top_up',
          error_code: 'unknown_error'
        });
        console.error(error);
      }
    }
  };

  const handleOfflineWithdrawal = async () => {
    try {
      const response = await RequestToWithdrawOffline(
        safeClientAccountId,
        safeAmount,
        safeAgentAccountId,
        accountCert,
        safeTransactionJwt,
      );
      if (response?.includes("Success")) {
        const transactionCert = response.replace(" Success", "");
        toast.success("Account successfully topped up.");
        // Log successful purchase
        await logEvent('purchase', { 
          transaction_id: transactionCert,
          currency: 'XAF',
          value: safeAmount
        });
        navigate("/success", {
          state: {
            transactionCert,
            accountId: safeAgentAccountId,
            accountCert: safeAgentAccountCert,
            clientName: safeClientName, // Include client name in success state
          },
        });
      } else if (response?.includes("Insufficient")) {
        toast.error(
          "Insufficient funds. Please ask the client to add funds to his account.",
        );
        // Log transaction failure
        await logEvent('transaction_failed', { 
          flow: 'withdraw',
          error_code: 'insufficient_funds'
        });
      }
    } catch (error) {
      toast.error("An error occurred while processing the transaction");
      // Log transaction failure
      await logEvent('transaction_failed', { 
        flow: 'withdraw',
        error_code: 'unknown_error'
      });
      console.error(error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full md:max-w-[650px] md:mx-auto">
        <div
          className={`bg-white w-full rounded-t-3xl transform transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "translate-y-full"}`}
          style={{ maxHeight: "85vh" }}
        >
          {/* Pull indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-6 pt-4 pb-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faCheckCircle} size="lg" />
              </div>
              <h2 className="text-xl font-bold text-center text-gray-800">
                Confirm Transaction
              </h2>
              <p className="text-gray-500 text-center text-sm mt-1">
                Please review the transaction details
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 mb-6">
              <div className="flex items-center mb-5 pb-5 border-b border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div>
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {safeClientName || "Anonymous"}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account ID
                  </p>
                  <p className="text-sm font-semibold text-gray-800 break-all">
                    {safeClientAccountId
                      ? `*******${safeClientAccountId.slice(-4)}`
                      : "Default Account ID"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faCoins} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {safeAmount ? `${safeAmount} XAF` : "Default Amount"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="py-4 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm flex items-center justify-center"
                onClick={handleDismiss}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>

              <button
                className="py-4 px-4 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm flex items-center justify-center"
                onClick={transactionJwt ? handleOfflineWithdrawal : handleTopUp}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Confirm
              </button>
            </div>

            {/* Safe area for bottom navigation on mobile */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBottomSheet;
