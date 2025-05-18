import { useMakeInit } from '@wua/hooks/useInitialization.ts';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const AccountLoadingPage = () => {
  const { makeInit } = useMakeInit();
  const navigate = useNavigate();

  const initializeAccount = useCallback(async () => {
    try {
      await makeInit();
      navigate('/onboarding-flow');
    } catch (error) {
      navigate('/');
      console.error('Error during account creation:', error);
      toast.error('Account creation failed. Please try again.');
    }
  }, [makeInit, navigate]);

  useEffect(() => {
    initializeAccount();
  }, [initializeAccount]);

  return (
    <div className='flex flex-col flex-grow items-center justify-center gap-4'>
      <h1 className='text-2xl lg:text-3xl font-bold text-gray-700 text-center px-4 max-w-md'>
        Please wait while we initiate the bank account process. This might take
        some time...
      </h1>
      <div className='relative flex items-center justify-center'>
        <div className='animate-spin rounded-full h-40 w-40 border-t-4 border-b-4 border-purple-500' />
        <img
          src='https://www.svgrepo.com/show/509001/avatar-thinking-9.svg'
          alt='Thinking Avatar'
          className='absolute rounded-full h-28 w-28'
        />
      </div>
    </div>
  );
};

export { AccountLoadingPage as Component };
