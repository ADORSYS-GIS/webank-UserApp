import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/Store";
import PhoneInput from "./pages/PhoneInput.tsx";
import PhoneVerification from "./pages/PhoneVerification.tsx";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";
import "./App.css";
import TopUpQRScannerPage from "./pages/TopUpQRScannerPage";
import GeneralQRScannerPage from "./pages/GeneralQRScannerPage";
import OfflineQRScannerPage from "./pages/OfflineQRScannerPage";
import AgentPage from "./pages/AgentPage";
import QRGenerator from "./pages/Qrcode";
import TopUpPage from "./pages/TopUpPage";
import SuccessPage from "./pages/SuccessPage";
import SettingsPage from "./kyc/pages/SettingsPage";
import EmailVerification from "./kyc/pages/emailVerification";
import EmailCode from "./kyc/pages/emailCode";
import IdentityVerificationPage from "./kyc/pages/IdentityVerificationPage";
import IDCardForm from "./kyc/pages/IDCardForm";
import DriverLicenseForm from "./kyc/pages/DriverLicenseForm";
import PassportForm from "./kyc/pages/PassportForm";
import TellerDashboard from "./pages/TellerPage";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LocationComponent from "./kyc/components/LocationComponent";
import KYCPage from "./kyc/pages/KycVerificationPage";
import KycCertChecker from "./kyc/pages/KycCertChecker";
import RecoverAccountPage from "./kyc/pages/RecoverAccountPage.tsx";
import RecoveryDashboard from "./kyc/pages/KycRecoveryPage";
import AccountRecoveryScannerPage from "./kyc/pages/AccountRecoveryScannerPage.tsx";
import RecoveryToken from "./kyc/pages/RecoveryToken";
import AccountConfirmation from "./kyc/pages/AccountConfirmation";
import MapConfirmation from "./kyc/components/MapConfirmation.tsx";
import OnboardingPage from "./pages/HomePage.tsx";
import DocumentImages from "./kyc/pages/DocumentImages.tsx";
import ShareHandlerPage from "./pages/ShareHandlerPage.tsx";
import { Toaster } from "sonner";
import GuidelinesPage from "./kyc/guidelines/GuidelinesPage.tsx";
import BottomNavigation from "./components/BottomNavigation";
import { useEffect, useState } from "react";
import BottomSheet from "./components/SideBar.tsx";
import AccountLoadingPage from "./pages/AccountLoadingPage";
import OnboardingFlow from "./components/OnboardingFlow";
import Layout from "./components/Layout";
import KYCReminderPopup from "./components/KYCReminderPopup";
import { useKYCReminder } from "./hooks/useKYCReminder";
import ContactsPage from "./pages/ContactsPage";
import PaymentSelectionPage from "./pages/PaymentSelectionPage";
import AgentTopUpPage from "./pages/AgentTopUpPage";

const App: React.FC = () => {
  const accountId = useSelector((state: RootState) => state.account.accountId);
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
          <Route path="/phone" element={<PhoneInput />} />
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
