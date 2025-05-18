import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface RejectionModalProps {
  onClose: () => void;
  onReject: (reason: string) => void;
}

const REJECTION_REASONS = [
  'Blurry ID',
  'Mismatched Selfie',
  'Expired Document',
  'Incomplete Information',
];

export const RejectionModal: React.FC<RejectionModalProps> = ({
  onClose,
  onReject,
}) => {
  const [selectedReason, setSelectedReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      return;
    }
    onReject(selectedReason);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h3 className='text-lg font-semibold'>Reject KYC Verification</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 p-2'
            aria-label='Close modal'>
            <FiX className='w-6 h-6' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          <div>
            <label
              htmlFor='rejectionReason'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Select Reason for Rejection
            </label>
            <select
              id='rejectionReason'
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              required>
              <option value=''>Select a reason</option>
              {REJECTION_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-white bg-rose-600 rounded-md hover:bg-rose-700'>
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
