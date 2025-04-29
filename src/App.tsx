import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/Store";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import "./App.css";
import QRScannerPage from "./pages/QRScannerPage";
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
import Layout from "./components/Layout";

const App: React.FC = () => {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get current location

  // Close menu whenever route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]); // Triggered when location changes
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
          <Route path="/loading" element={<AccountLoadingPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/qr-scan" element={<QRScannerPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/share-handler" element={<ShareHandlerPage />} />
          <Route path="/qrcode" element={<QRGenerator />} />
          <Route path="/top-up" element={<TopUpPage />} />
          <Route path="/success" element={<SuccessPage />} />
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
          <Route element={<ProtectedRoute />}>
            <Route path="/teller" element={<TellerDashboard />} />
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

      {/* Bottom Navigation */}
      {accountId && (
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
