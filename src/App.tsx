import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import "./App.css";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
      </Routes>
    </Router>
  );
};
export default App;
