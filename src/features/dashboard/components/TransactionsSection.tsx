import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  EyeOff,
  ChevronLeft,
  Loader,
} from "react-feather";

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
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const getButtonText = () => {
    if (loadingTransactions) {
      return (
        <>
          <Loader size={16} className="mr-2 animate-spin" />
          Loading...
        </>
      );
    }

    if (transactionsVisible) {
      return (
        <span className="flex items-center text-blue-500">
          <EyeOff size={16} className="mr-2" />
          Hide
        </span>
      );
    }

    return (
      <span className="flex items-center text-blue-500">
        View All
        <ChevronRight size={16} className="ml-1" />
      </span>
    );
  };
  const buttonText = getButtonText();

  // Function to handle toggling visibility
  const toggleVisibility = () => {
    if (!transactionsVisible) {
      fetchTransactions(); // Fetch transactions only when showing the list
    }
    setTransactionsVisible(!transactionsVisible); // Toggle visibility
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(transactionsData.length / transactionsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 transition-all duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Last Transactions</h3>
        <button
          onClick={toggleVisibility}
          className="text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
          disabled={loadingTransactions}
        >
          {buttonText}
        </button>
      </div>
      {transactionsVisible && (
        <div className="mt-4 space-y-4">
          {transactionsData.length > 0 ? (
            <>
              {transactionsData
                .slice(
                  (currentPage - 1) * transactionsPerPage,
                  currentPage * transactionsPerPage,
                )
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b border-gray-300"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.amount.startsWith("-")
                            ? "bg-red-50"
                            : "bg-blue-100"
                        }`}
                      >
                        {transaction.amount.startsWith("-") ? (
                          <ArrowUp size={16} className="text-red-500" />
                        ) : (
                          <ArrowDown size={16} className="text-teal-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-gray-800">
                          {transaction.title}
                        </span>
                        <span className="text-gray-500 text-sm block">
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-lg ${transaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}
                    >
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>

                <span className="text-sm text-gray-600 mx-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-gray-500">
              {loadingTransactions ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                "No transactions found."
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
