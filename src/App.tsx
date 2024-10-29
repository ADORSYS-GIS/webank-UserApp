// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header"; // Import the new Header component
import { useEffect } from "react";
import generateKeyPair from "./services/keyManagement/generateKey"; // Import the generate function
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    const handleAppInstalled = async () => {
      console.log("App installed successfully. Generating key pair...");

      // Generate RSA key pair
      await generateKeyPair();
      console.log("Key pair generated successfully.");
    };

    // Listen for the appinstalled event
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  return (
    <Router>
      <div className="app">
        <Header /> {/* Include the Header component */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
