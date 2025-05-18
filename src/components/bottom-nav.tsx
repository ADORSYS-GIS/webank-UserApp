import BottomNavigation from '@wua/components/BottomNavigation';
import BottomSheet from '@wua/components/SideBar';
import { useBottomNav } from '@wua/hooks/bottom-nav.ts';
import { RootState } from '@wua/store/Store.ts';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

export function BottomNav() {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  const { isMenuOpen, toggleMenu, setIsMenuOpen } = useBottomNav();

  const location = useLocation();
  const navigate = useNavigate();

  // Check if onboarding is completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (
      onboardingCompleted === 'true' &&
      location.pathname === '/onboarding-flow'
    ) {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location, setIsMenuOpen]);

  return (
    <>
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accountId={accountId || ''}
        accountCert={accountCert || ''}
      />

      <BottomNavigation
        accountId={accountId || ''}
        accountCert={accountCert || ''}
        toggleMenu={toggleMenu}
      />
    </>
  );
}
