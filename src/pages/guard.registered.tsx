import { Navigate, Outlet } from 'react-router';
import { useIsRegistered } from '@wua/hooks/account.auth.ts';
import { useId } from 'react';
import { BottomNav } from '@wua/components/bottom-nav';

const GuardRegistered = () => {
  const id = useId();
  const isRegistered = useIsRegistered();
  if (!isRegistered) {
    return (
      <Navigate
        to="/auth"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  return (
    <div id={`registered:${id}`}>
      <Outlet />

      <BottomNav />
    </div>
  );
};

export { GuardRegistered as Component };