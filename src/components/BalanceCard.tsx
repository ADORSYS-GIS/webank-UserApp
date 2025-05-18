import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

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
    <div className='bg-blue-600 rounded-xl p-6 shadow-md mb-6'>
      <div className='flex justify-between'>
        <div>
          <h3 className='font-semibold text-sm text-white opacity-80'>
            {accountId ? `ID: ${accountId}` : 'Account not found'}
          </h3>
          <p className='text-sm text-white mt-1'>Balance</p>
          <div className='flex items-center mt-1'>
            <p className='text-2xl font-bold text-white'>
              {balanceVisible ? `XAF ${balance}` : 'XAF •••••••'}
            </p>
            <button onClick={viewBalance} className='ml-2 text-white'>
              <FontAwesomeIcon icon={balanceVisible ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
