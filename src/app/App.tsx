import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useAccountStore } from "@state/accountStore";

// Auth Feature
import PhoneInput from "@features/auth/pages/PhoneInput";
import PhoneVerification from "@features/auth/pages/PhoneVerification";
import Login from "@features/auth/pages/Login";

// Dashboard Feature
import DashboardPage from "@features/dashboard/pages/DashboardPage";

// Transactions Feature
import TopUpPage from "@features/transactions/pages/TopUpPage";
import SuccessPage from "@features/transactions/pages/SuccessPage";
import ContactsPage from "@features/contacts/pages/ContactsPage";
import PaymentSelectionPage from "@features/transactions/pages/PaymentSelectionPage";
import AgentTopUpPage from "@features/teller/pages/AgentTopUpPage";

// QR Feature
import TopUpQRScannerPage from "@features/qr/pages/TopUpQRScannerPage";
import GeneralQRScannerPage from "@features/qr/pages/GeneralQRScannerPage";
import OfflineQRScannerPage from "@features/qr/pages/OfflineQRScannerPage";
import QRGenerator from "@features/qr/pages/Qrcode";

// Teller Feature
import TellerDashboard from "@features/teller/pages/TellerPage";
import AgentPage from "@features/teller/pages/AgentPage";

// KYC Feature
import SettingsPage from "@features/kyc/pages/SettingsPage";
import EmailVerification from "@features/kyc/pages/emailVerification";
import EmailCode from "@features/kyc/pages/emailCode";
import IdentityVerificationPage from "@features/kyc/pages/IdentityVerificationPage";
import IDCardForm from "@features/kyc/pages/IDCardForm";
import DriverLicenseForm from "@features/kyc/pages/DriverLicenseForm";
import PassportForm from "@features/kyc/pages/PassportForm";
import LocationComponent from "@features/kyc/components/LocationComponent";
import KYCPage from "@features/kyc/pages/KycVerificationPage";
import KycCertChecker from "@features/kyc/pages/KycCertChecker";
import RecoverAccountPage from "@features/kyc/pages/RecoverAccountPage";
import RecoveryDashboard from "@features/kyc/pages/KycRecoveryPage";
import AccountRecoveryScannerPage from "@features/kyc/pages/AccountRecoveryScannerPage";
import RecoveryToken from "@features/kyc/pages/RecoveryToken";
import AccountConfirmation from "@features/kyc/pages/AccountConfirmation";
import MapConfirmation from "@features/kyc/components/MapConfirmation";
import DocumentImages from "@features/kyc/pages/DocumentImages";
import GuidelinesPage from "@features/kyc/guidelines/GuidelinesPage";
import { useKYCReminder } from "@features/kyc/hooks/useKYCReminder";

// Shared Components
import Header from "@shared/components/Header";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import BottomNavigation from "@shared/components/BottomNavigation";
import BottomSheet from "@shared/components/SideBar";
import OnboardingFlow from "@shared/components/OnboardingFlow";
import Layout from "@shared/components/Layout";
import KYCReminderPopup from "@shared/components/KYCReminderPopup";

// Shared Pages
import AboutPage from "@shared/pages/AboutPage";
import OnboardingPage from "@shared/pages/HomePage";
import ShareHandlerPage from "@shared/pages/ShareHandlerPage";
import AccountLoadingPage from "@shared/pages/AccountLoadingPage";

// Styles
import "@app/App.css";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showReminder, handleClose } = useKYCReminder();
  const { accountId, onboardingCompleted } = useAccountStore();

  // Check if onboarding is completed
  useEffect(() => {
    if (onboardingCompleted && location.pathname === "/onboarding") {
      navigate("/dashboard");
    }
  }, [onboardingCompleted, location.pathname, navigate]);

  // Close menu whenever route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <Layout>
      <KycCertChecker />
      <Header />
      {/* Content wrapper with bottom padding when navigation is visible */}
      <div className={`${accountId ? "pb-16" : ""}`}>
        {/* Main Content Routes */}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={accountId ? <DashboardPage /> : <OnboardingPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/loading" element={<AccountLoadingPage />} />
          <Route path="/phone" element={<PhoneInput />} />
          <Route path="/phone/verification" element={<PhoneVerification />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/qr-scan" element={<GeneralQRScannerPage />} />
          <Route path="/qr-scan/top-up" element={<TopUpQRScannerPage />} />
          <Route path="/qr-scan/offline" element={<OfflineQRScannerPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/share-handler" element={<ShareHandlerPage />} />
          <Route path="/qrcode" element={<QRGenerator />} />
          <Route path="/top-up" element={<TopUpPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/payment-selection" element={<PaymentSelectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/inputEmail" element={<EmailVerification />} />
          <Route path="/emailCode" element={<EmailCode />} />
          <Route path="/kyc" element={<IdentityVerificationPage />} />
          <Route path="/verification/id-card" element={<IDCardForm />} />
          <Route
            path="/verification/location"
            element={<LocationComponent />}
          />
          <Route path="/verification/passport" element={<PassportForm />} />
          <Route path="/recoverAccount" element={<RecoverAccountPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route
            path="/verification/driving-license"
            element={<DriverLicenseForm />}
          />
          <Route path="/recovery/recoverytoken" element={<RecoveryToken />} />
          <Route path="/map-confirmation" element={<MapConfirmation />} />
          <Route path="/kyc/imgs" element={<DocumentImages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent-topup" element={<AgentTopUpPage />} />
          <Route path="/teller" element={<TellerDashboard />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/agency" element={<KYCPage />} />
            <Route path="/account-recovery" element={<RecoveryDashboard />} />
            <Route
              path="/recovery/recovery-scanner"
              element={<AccountRecoveryScannerPage />}
            />
            <Route
              path="/recovery/account-confirmation"
              element={<AccountConfirmation />}
            />
            <Route path="/recovery/recoverytoken" element={<RecoveryToken />} />
          </Route>
          <Route path="/map-confirmation" element={<MapConfirmation />} />
        </Routes>
      </div>

      {/* Bottom Navigation - Only show on dashboard and related pages */}
      {accountId &&
        !["/onboarding", "/phone-input", "/phone-verification"].includes(
          location.pathname,
        ) && <BottomNavigation toggleMenu={toggleMenu} />}

      <BottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* KYC Reminder Popup */}
      {showReminder && <KYCReminderPopup onClose={handleClose} />}

      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 2000,
          className:
            "px-4 py-3 rounded-lg text-sm shadow-sm w-full animation-slideDown",
        }}
      />
    </Layout>
  );
};

export default App;
