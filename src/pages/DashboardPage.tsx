// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../services/keyManagement/requestService";
import Header from "../components/Header1";
import BalanceCard from "../components/BalanceCard";
import TransactionsSection from "../components/TransactionsSection";
import ActionButtons from "../components/ActionButtons";
import Sidebar from "../components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";

const Dashboard: React.FC = () => {
  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Other states
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [transactionsVisible, setTransactionsVisible] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  // const accountCert = location.state?.accountCert;

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // View balance function
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
    } catch (error) {
      toast.error("Failed to retrieve balance. Please try again.");
    }
  };

  // Fetch transactions function
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
    <div className="relative flex h-screen overflow-hidden">
      {/* Sidebar overlay using a native button for accessibility */}
      {isSidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black opacity-50 focus:outline-none"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transform transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:inset-auto md:transform-none`}
      >
        <Sidebar accountCert={accountCert!} accountId={accountId!} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header onHamburgerClick={toggleSidebar} />
        <main className="flex-1 p-6 bg-gray-50 text-gray-800 overflow-auto">
          <BalanceCard
            balanceVisible={balanceVisible}
            balance={balance}
            viewBalance={viewBalance}
            accountId={accountId!}
          />
          <ActionButtons accountId={accountId!} accountCert={accountCert!} />
          <TransactionsSection
            transactionsData={transactionsData}
            transactionsVisible={transactionsVisible}
            setTransactionsVisible={setTransactionsVisible}
            fetchTransactions={fetchTransactions}
            loadingTransactions={loadingTransactions}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
