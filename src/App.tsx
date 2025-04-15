import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/Store";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import QRScannerPage from "./pages/QRScannerPage";
import AgentPage from "./pages/AgentPage";
import QRGenerator from "./pages/Qrcode";
import TopUpPage from "./pages/TopUpPage";
import SuccessPage from "./pages/SuccessPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AccountQR from "./pages/AccountQr";
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
import PostRegistration from "./pages/PostRegistration.tsx";
import MapConfirmation from "./kyc/components/MapConfirmation.tsx";
import UnderReview from "./kyc/pages/UnderReview.tsx";

const App: React.FC = () => {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  let homePageElement;
  if (accountId) {
    homePageElement = kycCert ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/under-review" replace />
    );
  } else {
    homePageElement = <Register />;
  }

  return (
    <HashRouter>
      <KycCertChecker /> {/* Ensures KYC checking runs in the background */}
      <Header />
      <Routes>
        <Route path="/" element={homePageElement} />
        <Route path="/otp" element={<OtpPage />} />
        <Route
          path="/dashboard"
          element={accountId ? <DashboardPage /> : <Navigate to="/" replace />}
        />
        <Route path="/qr-scan" element={<QRScannerPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/qrcode" element={<QRGenerator />} />
        <Route path="/top-up" element={<TopUpPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/account-qr" element={<AccountQR />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/inputEmail" element={<EmailVerification />} />
        <Route path="/emailCode" element={<EmailCode />} />
        <Route path="/kyc" element={<IdentityVerificationPage />} />
        <Route path="/verification/id-card" element={<IDCardForm />} />
        <Route path="/verification/location" element={<LocationComponent />} />
        <Route path="/verification/passport" element={<PassportForm />} />
        <Route path="/recoverAccount" element={<RecoverAccountPage />} />
        <Route
          path="/verification/driving-license"
          element={<DriverLicenseForm />}
        />
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
        <Route path="/post-registration" element={<PostRegistration />} />
        <Route path="/map-confirmation" element={<MapConfirmation />} />
        <Route path="/under-review" element={<UnderReview />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
