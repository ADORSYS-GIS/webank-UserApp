import KYCReminderPopup from '@wua/components/KYCReminderPopup';
import { useKYCReminder } from '@wua/hooks/useKYCReminder.ts';
import KycCertChecker from '@wua/kyc/pages/KycCertChecker';
import Header from '@wua/components/Header';
import { Outlet } from 'react-router';
import Layout from '@wua/components/Layout';

const AppInit = () => {
  const { showReminder, handleClose } = useKYCReminder();

  return (
    <Layout>
      <KycCertChecker />
      <Header />
      <Outlet />
      {showReminder && <KYCReminderPopup onClose={handleClose} />}
    </Layout>
  );
};

export { AppInit };