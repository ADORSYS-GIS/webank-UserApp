import { useState } from "react";
import { toast } from "sonner";
import { RequestToGetTransactionHistory } from "@services/keyManagement/requestService";

// Define a type for transaction objects. Adjust fields as needed based on actual API response.
import { Transaction } from '../types/transaction';

export function useTransactions(accountId: string | undefined, accountCert: string | undefined) {
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [transactionsVisible, setTransactionsVisible] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const fetchTransactions = async () => {
    if (!accountId || !accountCert) {
      toast.error("Account information is missing.");
      return;
    }
    try {
      setLoadingTransactions(true);
      const transactionsResponse = await RequestToGetTransactionHistory(accountId, accountCert);

      let transactions: Transaction[];
      if (typeof transactionsResponse === "string") {
        const trimmedResponse = transactionsResponse.trim();
        const endIndex = trimmedResponse.lastIndexOf("]");
        if (endIndex !== -1) {
          const validJson = trimmedResponse.substring(0, endIndex + 1);
          transactions = JSON.parse(validJson);
        } else {
          transactions = JSON.parse(trimmedResponse);
        }
      } else {
        transactions = transactionsResponse;
      }

      // Ensure all transactions conform to the unified Transaction type
      const mappedTransactions = transactions.map((tx: Transaction) => {
        const id = tx.id ?? (tx as Record<string, unknown>).transactionId ?? Math.random().toString(36).slice(2);
        const date = tx.date ?? (tx as Record<string, unknown>).timestamp ?? '';
        const amount = tx.amount ?? '';
        const title = tx.title ?? (tx as Record<string, unknown>).description ?? '';
        const description = tx.description ?? '';
        return {
          ...tx,
          id,
          date,
          amount,
          title,
          description,
        };
      });
      setTransactionsData(mappedTransactions);
      setTransactionsVisible(true);
    } catch (error) {
      toast.error("Failed to load transactions.");
    } finally {
      setLoadingTransactions(false);
    }
  };

  return {
    transactionsData,
    transactionsVisible,
    loadingTransactions,
    fetchTransactions,
    setTransactionsVisible,
  };
}