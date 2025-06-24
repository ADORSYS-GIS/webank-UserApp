import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

// Auth Feature
import PhoneInput from "@features/auth/pages/PhoneInput";
import PhoneVerification from "@features/auth/pages/PhoneVerification";
import Login from "@features/auth/pages/Login";

// Dashboard Feature
import DashboardPage from "@features/dashboard/pages/DashboardPage";

// Transactions Feature
import TopUpPage from "@features/transactions/pages/TopUpPage";
import SuccessPage from "@features/transactions/pages/SuccessPage";

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

// Features
import { useKYCReminder } from "@features/kyc/hooks/useKYCReminder";
import ContactsPage from "@features/contacts/pages/ContactsPage";
import PaymentSelectionPage from "@features/transactions/pages/PaymentSelectionPage";
import AgentTopUpPage from "@features/teller/pages/AgentTopUpPage";
import { TestComponent } from "@shared/components/TestComponent";

// Styles
import "@app/App.css";

const App: React.FC = () => {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  
  // Test component to verify path aliases
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Path Alias Test</h1>
        <TestComponent />
      </div>
    );
  }
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showReminder, handleClose } = useKYCReminder();

  // Check if onboarding is completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted === "true" && location.pathname === "/onboarding") {
      navigate("/dashboard");
    }
  }, [location.pathname, navigate]);

  // Close menu whenever route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  let homePageElement;

  if (accountId) {
    homePageElement = <DashboardPage />;
  } else {
    homePageElement = <OnboardingPage />;
  }

  return (
    <Layout>
      <KycCertChecker />
      <Header />
      {/* Content wrapper with bottom padding when navigation is visible */}
      <div className={`${accountId ? "pb-16" : ""}`}>
        {/* Main Content Routes */}
        <Routes>
          <Route path="/" element={homePageElement} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/loading" element={<AccountLoadingPage />} />
          <Route path="/phone/verification" element={<PhoneVerification />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/phone" element={<PhoneInput />} />
          <Route path="/topup" element={<TopUpPage />} />
          <Route path="/topup/qr" element={<TopUpQRScannerPage />} />
          <Route path="/scan" element={<GeneralQRScannerPage />} />
          <Route path="/offline-scan" element={<OfflineQRScannerPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/agent/topup" element={<AgentTopUpPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/qr" element={<QRGenerator />} />
          <Route path="/teller" element={<TellerDashboard />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/payment/select" element={<PaymentSelectionPage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/share" element={<ShareHandlerPage />} />
          
          {/* KYC Routes */}
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/kyc/settings" element={<SettingsPage />} />
          <Route path="/kyc/email/verify" element={<EmailVerification />} />
          <Route path="/kyc/email/code" element={<EmailCode />} />
          <Route path="/kyc/identity" element={<IdentityVerificationPage />} />
          <Route path="/kyc/id-card" element={<IDCardForm />} />
          <Route path="/kyc/driver-license" element={<DriverLicenseForm />} />
          <Route path="/kyc/passport" element={<PassportForm />} />
          <Route path="/kyc/location" element={<LocationComponent />} />
          <Route path="/kyc/recover" element={<RecoverAccountPage />} />
          <Route path="/kyc/recovery/dashboard" element={<RecoveryDashboard />} />
          <Route path="/kyc/recovery/scan" element={<AccountRecoveryScannerPage />} />
          <Route path="/kyc/recovery/token" element={<RecoveryToken />} />
          <Route path="/kyc/confirm" element={<AccountConfirmation />} />
          <Route path="/kyc/map" element={<MapConfirmation />} />
          <Route path="/kyc/documents" element={<DocumentImages />} />
          <Route path="/kyc/guidelines" element={<GuidelinesPage />} />
          <Route path="/kyc/check" element={<KycCertChecker />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/teller" element={<TellerDashboard />} />
            <Route path="/agency" element={<KYCPage />} />
            
            {/* KYC Recovery Routes */}
            <Route path="/account-recovery" element={<RecoveryDashboard />} />
            <Route path="/recovery/recovery-scanner" element={<AccountRecoveryScannerPage />} />
            <Route path="/recovery/account-confirmation" element={<AccountConfirmation />} />
            <Route path="/recovery/recoverytoken" element={<RecoveryToken />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Bottom Navigation - Only show on dashboard and related pages */}
      {accountId &&
        !["/onboarding", "/phone-input", "/phone-verification"].includes(
          location.pathname,
        ) && (
          <BottomNavigation
            accountId={accountId || ""}
            accountCert={accountCert || ""}
            toggleMenu={toggleMenu}
          />
        )}

      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accountId={accountId || ""}
        accountCert={accountCert || ""}
      />

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
