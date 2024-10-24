import "./App.css";
import Register from "./pages/RegisterPage.tsx";
import Otp from "./pages/OtpPage.tsx";

export default function App() {
  return (
    <>
      <div>
        <Register />;
      </div>

      <div>
        <Otp />
      </div>
    </>
  );
}
