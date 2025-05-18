import {
  faCheckCircle,
  faExclamationTriangle,
  faLock,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router';

interface KYCReminderPopupProps {
  onClose: () => void;
}

const KYCReminderPopup: React.FC<KYCReminderPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleVerify = () => {
    onClose(); // Close the popup before navigation
    navigate('/kyc');
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6'>
        <div className='text-center mb-6'>
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FontAwesomeIcon
              icon={faShieldAlt}
              className='text-blue-500 text-2xl'
            />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Verify Your Identity
          </h2>
          <p className='text-gray-600 text-sm'>
            Complete your KYC verification for enhanced security and better
            experience
          </p>
        </div>

        {/* Transaction Limit Warning */}
        <div className='bg-amber-50 rounded-xl p-4 mb-6'>
          <div className='flex items-start gap-3'>
            <div className='w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0'>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className='text-amber-500'
              />
            </div>
            <div>
              <h3 className='font-medium text-amber-800'>Transaction Limit</h3>
              <p className='text-sm text-amber-700'>
                Without KYC verification, you can only perform transactions up
                to 1,000 XAF
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className='space-y-4 mb-6'>
          <div className='flex items-start gap-3'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0'>
              <FontAwesomeIcon icon={faLock} className='text-blue-500' />
            </div>
            <div>
              <h3 className='font-medium text-gray-900'>Enhanced Security</h3>
              <p className='text-sm text-gray-600'>
                Protect your account with verified identity
              </p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0'>
              <FontAwesomeIcon icon={faCheckCircle} className='text-blue-500' />
            </div>
            <div>
              <h3 className='font-medium text-gray-900'>Better Experience</h3>
              <p className='text-sm text-gray-600'>
                Access all features without restrictions
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={handleVerify}
            className='w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors'>
            Verify My Identity
          </button>
          <button
            onClick={onClose}
            className='w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors'>
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCReminderPopup;
