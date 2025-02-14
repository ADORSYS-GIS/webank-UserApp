import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../services/keyManagement/requestService.ts";
import Header from "../components/Header1";
import BalanceCard from "../components/BalanceCard";
import TransactionsSection from "../components/TransactionsSection";
import ActionButtons from "../components/ActionButtons";

const Dashboard: React.FC = () => {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [transactionsVisible, setTransactionsVisible] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const location = useLocation();
  const accountId = location.state?.accountId;
  const accountCert = location.state?.accountCert;

  // Existing viewBalance function
  const viewBalance = async () => {
    if (balanceVisible) {
      setBalanceVisible(false);
      return;
    }
    try {
      const fetchedBalance = await RequestToGetBalance(accountId, accountCert);
      setBalance(fetchedBalance);
      setBalanceVisible(true);
    } catch (error) {
      toast.error("Failed to retrieve balance. Please try again.");
    }
  };

  // Function to fetch transaction history
  const fetchTransactions = async () => {
    if (!accountId || !accountCert) {
      toast.error("Account information is missing.");
      return;
    }
    try {
      setLoadingTransactions(true);
      const transactionsResponse = await RequestToGetTransactionHistory(
        accountId,
        accountCert,
      );

      let transactions;
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

      setTransactionsData(transactions);
      setTransactionsVisible(true);
    } catch (error) {
      toast.error("Failed to load transactions.");
    } finally {
      setLoadingTransactions(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 p-6">
      <Header />
      <BalanceCard
        balanceVisible={balanceVisible}
        balance={balance}
        viewBalance={viewBalance}
        accountId={accountId}
      />
      <ActionButtons accountId={accountId} />
      <TransactionsSection
        transactionsData={transactionsData}
        transactionsVisible={transactionsVisible}
        setTransactionsVisible={setTransactionsVisible}
        fetchTransactions={fetchTransactions}
        loadingTransactions={loadingTransactions}
      />
    </div>
  );
};

export default Dashboard;
