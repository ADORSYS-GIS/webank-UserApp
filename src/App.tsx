// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header"; // Import the new Header component
import { useEffect } from "react"; // Import the generate function
import "./App.css";
import storeKeyPair from "./services/keyManagement/storeKey";

const App: React.FC = () => {
  useEffect(() => {
    const handleAppInstalled = async () => {
      await storeKeyPair();
      console.log("Key pair generated and stored successfully.");
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
