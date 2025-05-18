import React from 'react';
import { FaAddressBook, FaQrcode } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';

const PaymentSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const show = location.state?.show;

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-8'>
          Choose Payment Method
        </h1>

        <div className='space-y-4'>
          <button
            onClick={() =>
              navigate('/contacts', { state: { show: 'Payment' } })
            }
            className='w-full flex items-center justify-center space-x-3 bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition-colors'>
            <FaAddressBook className='text-xl' />
            <span>Select from Contacts</span>
          </button>

          <button
            onClick={() =>
              navigate(show === 'Top Up' ? '/qr-scan/top-up' : '/qr-scan', {
                state: { show },
              })
            }
            className='w-full flex items-center justify-center space-x-3 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-colors'>
            <FaQrcode className='text-xl' />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className='w-full flex items-center justify-center space-x-3 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-300 transition-colors mt-4'>
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { PaymentSelectionPage as Component };
