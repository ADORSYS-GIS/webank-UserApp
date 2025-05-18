import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight,
  faChevronRight as faChevronRightIcon,
  faEyeSlash,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

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
          <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
          Loading...
        </>
      );
    }

    if (transactionsVisible) {
      return (
        <span className='flex items-center text-blue-500'>
          <FontAwesomeIcon icon={faEyeSlash} className='mr-2' />
          Hide
        </span>
      );
    }

    return (
      <span className='flex items-center text-blue-500'>
        View All
        <FontAwesomeIcon icon={faChevronRight} className='ml-1' />
      </span>
    );
  };
  const buttonText = getButtonText();

  const formatAmount = (amount: string) => {
    const isNegative = amount.startsWith('-');
    const numericValue = amount.replace(/[^0-9.]/g, '');
    return `${isNegative ? '-' : ''}XAF ${numericValue}`;
  };

  // Function to handle toggling visibility
  const toggleVisibility = () => {
    if (!transactionsVisible) {
      fetchTransactions(); // Fetch transactions only when showing the list
    }
    setTransactionsVisible(!transactionsVisible); // Toggle visibility
    setCurrentPage(1); // Reset to first page when toggling visibility
  };

  // Calculate pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactionsData.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );
  const totalPages = Math.ceil(transactionsData.length / transactionsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='bg-white rounded-lg p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-gray-700 font-medium text-lg'>Payment History</h3>
        <button
          onClick={toggleVisibility}
          className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
          disabled={loadingTransactions}>
          {buttonText}
        </button>
      </div>

      {transactionsVisible ? (
        <div className='space-y-4'>
          {currentTransactions.length > 0 ? (
            <>
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className='flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0'>
                  <div className='flex items-center flex-1'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.amount.startsWith('-')
                          ? 'bg-red-50'
                          : 'bg-blue-100'
                      }`}>
                      <FontAwesomeIcon
                        icon={
                          transaction.amount.startsWith('-')
                            ? faArrowUp
                            : faArrowDown
                        }
                        className={`text-sm ${
                          transaction.amount.startsWith('-')
                            ? 'text-red-500'
                            : 'text-teal-500'
                        }`}
                      />
                    </div>
                    <div className='flex-1'>
                      <span className='text-gray-800 font-medium text-sm block'>
                        {transaction.title}
                      </span>
                      <span className='text-gray-700 text-xs block mt-1'>
                        {transaction.date}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm min-w-[100px] text-right ${
                      transaction.amount.startsWith('-')
                        ? 'text-red-500'
                        : 'text-teal-500'
                    }`}>
                    {formatAmount(transaction.amount)}
                  </span>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className='flex justify-center items-center space-x-2 mt-4'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    aria-label='Previous page'>
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className='text-gray-600'
                    />
                  </button>

                  <span className='text-sm text-gray-600'>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    aria-label='Next page'>
                    <FontAwesomeIcon
                      icon={faChevronRightIcon}
                      className='text-gray-600'
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-6 text-gray-500'>
              {loadingTransactions ? (
                <FontAwesomeIcon icon={faSpinner} spin className='text-2xl' />
              ) : (
                'No transactions found.'
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='w-full h-64 rounded-lg overflow-hidden'>
          <img
            src='/trans.jpg'
            alt='Transaction illustration'
            className='w-full h-full object-contain p-4'
          />
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
