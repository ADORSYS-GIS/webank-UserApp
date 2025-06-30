import { useState } from "react";
import { toast } from "sonner";
import { RequestToGetBalance } from "@services/keyManagement/requestService";

export function useBalance(accountId: string | undefined, accountCert: string | undefined) {
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(false);

  const viewBalance = async () => {
    if (balanceVisible) {
      setBalanceVisible(false);
      return;
    }
    try {
      if (!accountId || !accountCert) {
        toast.error("Account information is missing.");
        return;
      }
      const fetchedBalance = await RequestToGetBalance(accountId, accountCert);
      setBalance(fetchedBalance);
      setBalanceVisible(true);
    } catch (error: unknown) {
      toast.error("Failed to retrieve balance. Please try again.");
    }
  };

  return { balance, balanceVisible, viewBalance, setBalanceVisible };
}