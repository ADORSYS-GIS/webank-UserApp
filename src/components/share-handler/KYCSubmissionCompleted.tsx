import {
  faCheckCircle,
  faHome,
  faIdCard,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function KYCSubmissionCompleted() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden'>
        {/* Success banner */}
        <div className='bg-blue-500 py-6 px-6 flex items-center justify-center'>
          <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center'>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className='text-blue-500 text-4xl'
            />
          </div>
        </div>

        <div className='p-8'>
          <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>
            KYC Documents Already Submitted
          </h1>

          <p className='text-gray-600 text-center mb-6'>
            Your identity verification documents have been successfully
            submitted. There's no need to resubmit your information.
          </p>

          <div className='bg-blue-50 rounded-xl p-6 mb-8'>
            <div className='flex items-center space-x-4 mb-4'>
              <div className='w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center'>
                <FontAwesomeIcon icon={faIdCard} />
              </div>
              <div>
                <h3 className='font-medium text-gray-800'>Identity Verified</h3>
                <p className='text-sm text-gray-600'>
                  Your docs information has been submitted
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center'>
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <div>
                <h3 className='font-medium text-gray-800'>Account Secured</h3>
                <p className='text-sm text-gray-600'>
                  Please wait for your kyc to be Approved
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <button
              onClick={handleReturnToDashboard}
              className='py-4 px-6 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm flex items-center justify-center'>
              <FontAwesomeIcon icon={faHome} className='mr-2' />
              Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>

      <div className='mt-8 text-center'>
        <p className='text-sm text-gray-500'>
          Need help? Contact our{' '}
          <span className='text-blue-500 font-medium'>Support Team</span>
        </p>
      </div>
    </div>
  );
}
