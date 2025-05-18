import { AuthFooter } from '@wua/components/auth.footer.tsx';
import { useIsRegistered } from '@wua/hooks/account.auth.ts';
import { useId } from 'react';
import { Navigate, Outlet } from 'react-router';

const GuardNonRegistered = () => {
  const id = useId();
  const isRegistered = useIsRegistered();
  if (isRegistered) {
    return (
      <Navigate to='/' state={{ from: window.location.pathname }} replace />
    );
  }

  return (
    <div
      id={`registered:${id}`}
      className='min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50'>
      <Outlet />

      <AuthFooter />
    </div>
  );
};

export { GuardNonRegistered as Component };
