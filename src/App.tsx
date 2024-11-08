// src/App.tsx
import { BrowserRouter as Router, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import "./App.css";
import { FaroRoutes } from "@grafana/faro-react";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <FaroRoutes>
        <Route path="/" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </FaroRoutes>
    </Router>
  );
};

export default App;
