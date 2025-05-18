import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { RequestToAgentTopup } from '../services/keyManagement/requestService';

interface TopUpFormProps {
  tellerAccountCert: string;
}

const TopUpForm: React.FC<TopUpFormProps> = ({ tellerAccountCert }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientAccountId: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const response = await RequestToAgentTopup(
        formData.clientAccountId,
        amount,
        tellerAccountCert,
      );

      if (response.includes('successfully')) {
        toast.success('Top-up successful!');
        navigate('/');
        setFormData({ clientAccountId: '', amount: '' });
      } else {
        toast.error('Failed to process top-up. Please try again.');
      }
    } catch (error) {
      console.error('Top-up error:', error);
      toast.error('Failed to process top-up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8'>
        <button
          onClick={() => navigate('/')}
          className='text-gray-600 hover:text-red-500 transition float-right'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M18 6L6 18M6 6l12 12' />
          </svg>
        </button>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Top Up Account
        </h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='clientAccountId'
              className='block text-sm font-medium text-gray-700 mb-2'>
              Client Account ID
            </label>
            <input
              type='text'
              id='clientAccountId'
              name='clientAccountId'
              value={formData.clientAccountId}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='amount'
              className='block text-sm font-medium text-gray-700 mb-2'>
              Amount (XAF)
            </label>
            <input
              type='number'
              id='amount'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
              min='0'
              step='0.01'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? 'Processing...' : 'Top Up Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TopUpForm;
