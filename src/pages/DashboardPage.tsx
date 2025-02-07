import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faBell,
  faCog,
  faSpinner,
  faPlusCircle,
  faMinusCircle,
  IconName,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { useLocation } from "react-router-dom";
import Logo from "../assets/Webank.png";
import { toast } from "react-toastify";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../services/keyManagement/requestService.ts";

const Dashboard: React.FC = () => {
  // Existing state for balance
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  interface Transaction {
    id: number;
    icon: IconDefinition | IconName;
    date: number;
    amount: string;
    title: string;
  }
  // New states for transactions
  const [transactionsVisible, setTransactionsVisible] = useState(false);
  const [transactionsData, setTransactionsData] = useState<Array<Transaction>>(
    [],
  );
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
      console.log("Balance fetched successfully:", fetchedBalance);
      setBalance(fetchedBalance);
      setBalanceVisible(true);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to retrieve balance. Please try again.");
    }
  };

  // New function to fetch transaction history
  const fetchTransactions = async () => {
    if (!accountId || !accountCert) {
      toast.error("Account information is missing.");
      return;
    }
    try {
      setLoadingTransactions(true);
      // Call your service to get transaction history.
      const transactionsResponse = await RequestToGetTransactionHistory(
        accountId,
        accountCert,
      );

      // If the response is a string, clean it up before parsing.
      let transactions;
      if (typeof transactionsResponse === "string") {
        // Trim leading/trailing whitespace.
        const trimmedResponse = transactionsResponse.trim();
        // Find the last occurrence of the closing bracket.
        const endIndex = trimmedResponse.lastIndexOf("]");
        if (endIndex !== -1) {
          // Extract the valid JSON substring.
          const validJson = trimmedResponse.substring(0, endIndex + 1);
          transactions = JSON.parse(validJson);
        } else {
          // If no closing bracket is found, try to parse the trimmed response.
          transactions = JSON.parse(trimmedResponse);
        }
      } else {
        // If the response is already an object, use it directly.
        transactions = transactionsResponse;
      }

      setTransactionsData(transactions);
      setTransactionsVisible(true);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions.");
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Component to display the transactions section

  const TransactionsSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 transition-all duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Last Transactions</h3>
        <button
          onClick={
            transactionsVisible
              ? () => setTransactionsVisible(false)
              : fetchTransactions
          }
          className="text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
          disabled={loadingTransactions}
        >
          {loadingTransactions ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Loading...
            </>
          ) : transactionsVisible ? (
            "Hide Transactions"
          ) : (
            "View Last Transactions"
          )}
        </button>
      </div>
      {transactionsVisible && (
        <div className="mt-4 space-y-4">
          {transactionsData.length > 0 ? (
            transactionsData.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b border-gray-300"
              >
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                    <FontAwesomeIcon
                      icon={
                        transaction.amount.startsWith("-")
                          ? faMinusCircle
                          : faPlusCircle
                      } // Set icon dynamically based on the amount.
                      className="text-white"
                    />
                  </div>
                  <div>
                    <span className="text-gray-800">{transaction.title}</span>
                    <span className="text-gray-500 text-sm block">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-lg ${
                    transaction.amount.startsWith("-")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {transaction.amount}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No transactions found.
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="logo">
          <img src={Logo} alt="Logo WeBank" className="w-20" />
          <h1 className="text-xl font-semibold">Hi, Welcome</h1>
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <img
              src="https://www.flaticon.com/free-icon/profile_3135715"
              alt="Profile"
              className="rounded-full h-10 w-10"
            />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FontAwesomeIcon icon={faCog} className="text-lg" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
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
          <h3 className="text-white">Available Balance</h3>
          <p className="text-white">
            {accountId ? `CM-${accountId}` : "Account not found"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
            label: "Top Up",
          },
          {
            icon: "https://cdn-icons-png.flaticon.com/512/4475/4475436.png",
            label: "Transfer",
          },
          {
            icon: "https://cdn-icons-png.flaticon.com/512/736/736948.png",
            label: "Withdraw",
          },
          {
            icon: "https://cdn-icons-png.flaticon.com/512/1235/1235446.png",
            label: "Pay",
          },
        ].map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition duration-300"
          >
            <img src={action.icon} alt={action.label} className="h-10 w-10" />
            <span className="mt-2 text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Transactions Section */}
      <TransactionsSection />
    </div>
  );
};

export default Dashboard;
