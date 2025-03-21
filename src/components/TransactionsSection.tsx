import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faMoneyBillWave,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";

interface Transaction {
  id: number;
  date: number;
  amount: string;
  title: string;
}

interface TransactionsSectionProps {
  transactionsVisible: boolean;
  transactionsData: Array<Transaction>;
  fetchTransactions: () => void;
  setTransactionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  loadingTransactions: boolean;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactionsVisible,
  transactionsData,
  fetchTransactions,
  setTransactionsVisible,
  loadingTransactions,
}) => {
  // Determine the button text based on loading state and visibility
  let buttonText: string | JSX.Element;
  if (loadingTransactions) {
    buttonText = (
      <>
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        Loading...
      </>
    );
  } else if (transactionsVisible) {
    buttonText = "Hide Transactions";
  } else {
    buttonText = "View All Transactions";
  }

  return (
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
          {buttonText}
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
                          ? faMoneyBillWave
                          : faHandHoldingDollar
                      }
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
                  className={`text-lg ${transaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}
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
};

export default TransactionsSection;
