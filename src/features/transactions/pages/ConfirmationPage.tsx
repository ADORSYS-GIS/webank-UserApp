import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useMoneyTransferServicePostApiTransfersPayout,
  useAccountWithdrawalServicePostApiAccountsWithdraw,
} from "openapi/generated/obs/queries/queries";
import { toast } from "sonner";
import { CheckCircle, X, DollarSign, CreditCard } from "react-feather";

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
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Make sure data has a clientName property even if it wasn't passed
  const safeData = {
    ...data,
    clientName: data.clientName || "Anonymous",
  };

  const {
    clientAccountId,
    amount,
    agentAccountId,
    agentAccountCert,
    transactionJwt,
    show,
    clientName,
  } = safeData;
  if (transactionJwt) {
    localStorage.setItem("transactionCert", transactionJwt);
  }
  console.log("Confirmation Page Data:", safeData);
  console.log("Client Name in Confirmation:", clientName);

  useEffect(() => {
    // Animate the bottom sheet entry
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const topUpMutation = useMoneyTransferServicePostApiTransfersPayout();

  // Helper: handle offline navigation for different show types
  function handleOfflineNavigation(type: string) {
    if (type !== "Transfer" && type !== "Payment" && type !== "Top up") {
      toast.info("Oops, you are offline. Initiating offline withdrawal...", {
        duration: 5000,
      });
      setTimeout(() => {
        navigate({
          to: "/top-up",
          state: {
            clientAccountId,
            amount,
            isClientOffline: true,
            clientName,
          } as never,
        });
        handleDismiss();
      }, 5000);
    } else if (type === "Transfer") {
      toast.error("Cannot transfer offline. Redirecting you to dashboard...");
      setTimeout(() => navigate({ to: "/" }), 4000);
    } else if (type === "Top up") {
      toast.error("Cannot top up offline. Redirecting you to dashboard...");
      setTimeout(() => navigate({ to: "/" }), 4000);
    } else if (type === "Payment") {
      toast.error("Cannot do payment offline. Redirecting you to dashboard...");
      setTimeout(() => navigate({ to: "/" }), 4000);
    }
  }

  // Helper: handle the online top-up logic
  async function handleOnlineTopUp() {
    try {
      const response = await topUpMutation.mutateAsync({
        requestBody: {
          senderAccountId: agentAccountId,
          recipientAccountId: clientAccountId,
          amount,
        },
      });
      if (response?.status === "COMPLETED" || response?.status === "PENDING") {
        const transactionCert = response?.transactionId ?? "";
        toast.success(`${show} successfully completed.`);
        navigate({
          to: "/success",
          state: {
            transactionCert,
            accountId: agentAccountId,
            accountCert: agentAccountCert,
            clientName,
          } as never,
        });
      } else {
        toast.error(response?.message ?? "Top up failed.");
      }
    } catch (error) {
      toast.error("An error occurred while processing the transaction");
      console.error(error);
    }
  }

  const handleTopUp = async () => {
    if (!navigator.onLine) {
      handleOfflineNavigation(show);
    } else {
      await handleOnlineTopUp();
    }
  };

  const withdrawalMutation =
    useAccountWithdrawalServicePostApiAccountsWithdraw();

  const handleOfflineWithdrawal = async () => {
    try {
      const response = await withdrawalMutation.mutateAsync({
        requestBody: {
          senderAccountId: agentAccountId,
          recipientAccountId: clientAccountId,
          amount,
        },
      });
      if (response?.status === "COMPLETED" || response?.status === "PENDING") {
        const transactionCert = response?.transactionId ?? "";
        toast.success("Account successfully topped up.");
        navigate({
          to: "/success",
          state: {
            transactionCert,
            accountId: agentAccountId,
            accountCert: agentAccountCert,
            clientName, // Include client name in success state
          } as never,
        });
      } else if (response?.status === "INSUFFICIENT_FUNDS") {
        toast.error(
          "Insufficient funds. Please ask the client to add funds to his account.",
        );
      } else {
        toast.error(response?.message ?? "Withdrawal failed.");
      }
    } catch (error) {
      toast.error("An error occurred while processing the transaction");
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
                <CheckCircle className="w-8 h-8" />
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
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {clientName || "Anonymous"}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account ID
                  </p>
                  <p className="text-sm font-semibold text-gray-800 break-all">
                    {clientAccountId
                      ? `*******${clientAccountId.slice(-4)}`
                      : "Default Account ID"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {amount ? `${amount} XAF` : "Default Amount"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="py-4 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm flex items-center justify-center"
                onClick={handleDismiss}
              >
                <X className="mr-2" />
                Cancel
              </button>

              <button
                className="py-4 px-4 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm flex items-center justify-center"
                onClick={transactionJwt ? handleOfflineWithdrawal : handleTopUp}
              >
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
