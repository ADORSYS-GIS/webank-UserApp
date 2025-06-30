// src/pages/Dashboard.tsx
import React from "react";
import { toast } from "sonner";
import { useMenuToggle } from "../hooks/useMenuToggle";
import { useBalance } from "../hooks/useBalance";
import { useTransactions } from "../hooks/useTransactions";

import Header1 from "@shared/components/Header1";
import BalanceCard from "../components/BalanceCard";
import TransactionsSection from "../components/TransactionsSection";
import ActionButtons from "@shared/components/ActionButtons";
import BottomNavigation from "@shared/components/BottomNavigation";
import BottomSheet from "@shared/components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Custom hooks for state and business logic
  const { isMenuOpen, toggleMenu } = useMenuToggle();
  const accountId = useSelector((state: RootState) => state.account.accountId) ?? undefined;
  const accountCert = useSelector((state: RootState) => state.account.accountCert) ?? undefined;
  const { balance, balanceVisible, viewBalance } = useBalance(accountId, accountCert);
  const { transactionsData, transactionsVisible, loadingTransactions, fetchTransactions, setTransactionsVisible } = useTransactions(accountId, accountCert);



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
        onClose={toggleMenu}
        accountId={accountId ?? ""}
        accountCert={accountCert ?? ""}
      />
    </div>
  );
};

export default Dashboard;
