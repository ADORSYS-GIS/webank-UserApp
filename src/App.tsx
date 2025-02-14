// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import TopUpPage from "./pages/TopUpPage"; // Importe la nouvelle page TopUpPage
import Header from "./components/Header";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Ajoute la route pour la page de Top-up */}
        <Route path="/top-up" element={<TopUpPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
