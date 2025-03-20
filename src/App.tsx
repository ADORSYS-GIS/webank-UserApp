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

const App: React.FC = () => {
  const accountId = useSelector((state: RootState) => state.account.accountId);

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            accountId ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />
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
        <Route
          path="/verification/driving-license"
          element={<DriverLicenseForm />}
        />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/teller" element={<TellerDashboard />} />
          <Route path="/agency" element={<KYCPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
