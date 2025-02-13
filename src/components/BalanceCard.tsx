import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface BalanceCardProps {
  balanceVisible: boolean;
  balance: string | null;
  viewBalance: () => void;
  accountId: string | undefined;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  balanceVisible,
  balance,
  viewBalance,
  accountId,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 shadow-lg mb-6">
      <h2 className="text-3xl font-bold text-white">Webank</h2>
      <h3 className="text-sm mt-2 text-white">Current Balance</h3>
      <div className="flex items-center mt-1">
        <p className="text-4xl font-bold text-white">
          {balanceVisible ? `XAF ${balance}` : "****"}
        </p>
        <button onClick={viewBalance} className="ml-2 text-white">
          <FontAwesomeIcon icon={balanceVisible ? faEyeSlash : faEye} />
        </button>
      </div>
      <div className="justify-between items-center mt-4">
        <h3 className="text-white">Account ID</h3>
        <p className="text-white">
          {accountId ? `CM-${accountId}` : "Account not found"}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
