// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the CSS
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../services/keyManagement/requestService";
import Header from "../components/Header1"; // Import the new Header component
import BalanceCard from "../components/BalanceCard";
import TransactionsSection from "../components/TransactionsSection";
import ActionButtons from "../components/ActionButtons";
import BottomNavigation from "../components/BottomNavigation";
import BottomSheet from "../components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";

const Dashboard: React.FC = () => {
  // Bottom sheet state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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

  // Handler for notification clicks
  const handleNotificationClick = () => {
    toast.info("Notifications feature coming soon!");
  };

  // Handler for about clicks
  const handleAboutClick = () => {
    toast.info("About page coming soon!");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header placement */}
      <Header
        username="We-Users"
        onNotificationClick={handleNotificationClick}
        onAboutClick={handleAboutClick}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-16 ">
        <div className="p-4">
          <BalanceCard
            balanceVisible={balanceVisible}
            balance={balance}
            viewBalance={viewBalance}
            accountId={accountId || ""}
          />
          <ActionButtons
            accountId={accountId || ""}
            accountCert={accountCert || ""}
          />
          <TransactionsSection
            transactionsData={transactionsData}
            transactionsVisible={transactionsVisible}
            setTransactionsVisible={setTransactionsVisible}
            fetchTransactions={fetchTransactions}
            loadingTransactions={loadingTransactions}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        accountId={accountId || ""}
        accountCert={accountCert || ""}
        toggleMenu={toggleMenu}
      />

      {/* Bottom Sheet Menu */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accountId={accountId || ""}
        accountCert={accountCert || ""}
      />

      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Dashboard;
