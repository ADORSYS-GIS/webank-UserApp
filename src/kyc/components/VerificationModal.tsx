import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router';

interface VerificationModalProps {
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[9999]'>
      <div
        className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out relative'
        style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex-grow text-center'>
            <h2 className='text-lg font-bold'>Verification Option</h2>
          </div>
          <button
            onClick={onClose} // Changed from setIsOpen(false) to onClose
            className='text-gray-600 hover:text-gray-800 text-xl focus:outline-none'>
            ×
          </button>
        </div>

        <ul className='space-y-3'>
          <li>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/verification/id-card');
                onClose();
              }}
              className='w-full py-3 px-4 border border-gray-300 rounded-full hover:bg-blue-100 transition duration-200'>
              ID CARD
            </motion.button>
          </li>
          <li>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/verification/passport');
                onClose();
              }}
              className='w-full py-3 px-4 border border-gray-300 rounded-full hover:bg-blue-100 transition duration-200'>
              PASSPORT
            </motion.button>
          </li>
          <li>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/verification/driving-license');
                onClose();
              }}
              className='w-full py-3 px-4 border border-gray-300 rounded-full hover:bg-blue-100 transition duration-200'>
              DRIVING LICENSE
            </motion.button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VerificationModal;
