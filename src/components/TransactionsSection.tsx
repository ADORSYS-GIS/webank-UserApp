import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowDown,
  faArrowUp,
  faChevronRight,
  faEyeSlash,
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
  const buttonText = loadingTransactions ? (
    <>
      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      Loading...
    </>
  ) : transactionsVisible ? (
    <span className="flex items-center text-blue-500">
      <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
      Hide
    </span>
  ) : (
    <span className="flex items-center text-blue-500">
      View All
      <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
    </span>
  );

  // const formatDateTime = (timestamp: number) => {
  //   return new Date(timestamp).toLocaleString("en-US", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  const formatAmount = (amount: string) => {
    const isNegative = amount.startsWith("-");
    const numericValue = amount.replace(/[^0-9.]/g, "");
    return `${isNegative ? "-" : ""}XAF ${numericValue}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-medium text-lg">Payment History</h3>
        <button
          onClick={() => {
            if (transactionsVisible) {
              setTransactionsVisible(false);
            } else {
              fetchTransactions();
              setTransactionsVisible(true);
            }
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          disabled={loadingTransactions}
        >
          {buttonText}
        </button>
      </div>

      {transactionsVisible ? (
        <div className="space-y-4">
          {transactionsData.length > 0 ? (
            transactionsData.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      transaction.amount.startsWith("-")
                        ? "bg-red-50"
                        : "bg-blue-100"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        transaction.amount.startsWith("-")
                          ? faArrowUp
                          : faArrowDown
                      }
                      className={`text-sm ${
                        transaction.amount.startsWith("-")
                          ? "text-red-500"
                          : "text-teal-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium text-sm block">
                      {transaction.title}
                    </span>
                    <span className="text-gray-700 text-xs block mt-1">
                      {transaction.date}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-sm min-w-[100px] text-right ${
                    transaction.amount.startsWith("-")
                      ? "text-red-500"
                      : "text-teal-500"
                  }`}
                >
                  {formatAmount(transaction.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              {loadingTransactions ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
              ) : (
                "No transactions found."
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <img
            src="/trans.jpg"
            alt="Transaction illustration"
            className="w-full h-full object-contain p-4"
          />
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
