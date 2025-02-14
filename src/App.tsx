// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/qr-scan" element={<QRScannerPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/qrcode" element={<QRGenerator />} />
        <Route path="/top-up" element={<TopUpPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
