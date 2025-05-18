import Header from '@wua/components/Header';
import KYCReminderPopup from '@wua/components/KYCReminderPopup';
import Layout from '@wua/components/Layout';
import { useKYCReminder } from '@wua/hooks/useKYCReminder.ts';
import KycCertChecker from '@wua/kyc/pages/KycCertChecker';
import { Outlet } from 'react-router';

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
