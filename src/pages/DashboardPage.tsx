// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { toast } from "sonner";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../services/keyManagement/requestService";
import Header1 from "../components/Header1";
import BalanceCard from "../components/BalanceCard";
import TransactionsSection from "../components/TransactionsSection";
import ActionButtons from "../components/ActionButtons";
import BottomNavigation from "../components/BottomNavigation";
import BottomSheet from "../components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useNavigate } from "react-router-dom";
import { logEvent } from "../utils/analytics";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Bottom sheet state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const viewBalance = async () => {
    if (balanceVisible) {
      setBalanceVisible(false);
      return;
    }
    try {
      if (!accountId || !accountCert) {
        // Log missing account info error
        logEvent('view_balance_failed', {
          error_type: 'missing_account_info',
          error_message: 'Account ID or Certificate is missing'
        });
        toast.error("Account information is missing.");
        return;
      }
      const fetchedBalance = await RequestToGetBalance(accountId, accountCert);
      setBalance(fetchedBalance);
      setBalanceVisible(true);
      
      // Log balance view with specific event
      logEvent('view_balance', { 
        account_id: accountId,
        balance: fetchedBalance
      });
    } catch (error) {
      console.error("Error retrieving balance:", error);
      // Log balance view error with more details
      logEvent('view_balance_failed', {
        error_type: 'balance_retrieval_failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        account_id: accountId
      });
      toast.error("Failed to retrieve balance. Please try again.");
    }
  };

  // Fetch transactions function
  const fetchTransactions = async () => {
    if (!accountId || !accountCert) {
      // Log missing account info error
      logEvent('view_transactions_failed', {
        error_type: 'missing_account_info',
        error_message: 'Account ID or Certificate is missing'
      });
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
      
      // Log transaction history view with specific event
      logEvent('view_transactions', {
        account_id: accountId,
        transaction_count: transactions.length,
        has_transactions: transactions.length > 0
      });
    } catch (error) {
      console.error("Error loading transactions:", error);
      // Log transaction view error with more details
      logEvent('view_transactions_failed', {
        error_type: 'transaction_history_load_failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        account_id: accountId
      });
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
    navigate("/about");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header placement - Pass the toggleMenu function as onServiceMenuClick */}
      <Header1
        onNotificationClick={handleNotificationClick}
        onAboutClick={handleAboutClick}
        onServiceMenuClick={toggleMenu}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-16 ">
        <div className="p-4">
          <BalanceCard
            balanceVisible={balanceVisible}
            balance={balance}
            viewBalance={viewBalance}
            accountId={accountId ?? ""}
          />
          <ActionButtons
            accountId={accountId ?? ""}
            accountCert={accountCert ?? ""}
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
        accountId={accountId ?? ""}
        accountCert={accountCert ?? ""}
        toggleMenu={toggleMenu}
      />

      {/* Bottom Sheet Menu */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accountId={accountId ?? ""}
        accountCert={accountCert ?? ""}
      />
    </div>
  );
};

export default Dashboard;
