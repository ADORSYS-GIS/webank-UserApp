import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@state/Store";
import { RequestToTopup, RequestToWithdrawOffline } from "@services/keyManagement/requestService";

export interface UseConfirmationBottomSheetProps {
  data: {
    clientAccountId: string;
    amount: number;
    agentAccountId: string;
    agentAccountCert: string;
    transactionJwt?: string;
    show: string;
    clientName: string;
  };
  onDismiss: () => void;
}

export function useConfirmationBottomSheet({ data, onDismiss }: UseConfirmationBottomSheetProps) {
  const navigate = useNavigate();
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const accountCert = useSelector((state: RootState) => state.account.accountCert);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

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
            clientName,
          },
        });
      }, 4000);
    } else if (!navigator.onLine && show === "Transfer") {
      toast.info("Oops, you are offline. Redirecting to the amount page...");
      setTimeout(() => {
        navigate("/top-up", {
          state: {
            clientAccountId,
            amount,
            isClientOffline: true,
            clientName,
          },
        });
      }, 4000);
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
              clientName,
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
        accountCert,
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
            clientName,
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

  return {
    isVisible,
    setIsVisible,
    handleDismiss,
    handleTopUp,
    handleOfflineWithdrawal,
    kycCert,
    accountCert,
    ...safeData,
  };
}
