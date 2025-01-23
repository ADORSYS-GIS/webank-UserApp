// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// import useInitialization from "./hooks/useInitialization";

const App: React.FC = () => {
  // useInitialization()
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
