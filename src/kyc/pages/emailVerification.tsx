import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDisableScroll from "../../hooks/useDisableScroll";
import { RequestToSendEmailOTP } from "../../services/keyManagement/requestService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const InputEmail: React.FC = () => {
  useDisableScroll();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const accountId = useSelector((state: RootState) => state.account.accountId);

  const handleProceed = async () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email)) {
      try {
        if (!accountId || !accountCert) {
          navigate("/dashboard");
          toast.error("Account information is missing.");
          return;
        }
        await RequestToSendEmailOTP(email, accountCert, accountId);
        navigate("/emailCode", { state: { email, accountCert } });
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      }
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <div
      className="h-screen flex flex-col bg-gray-50 overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Enhanced Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go Back"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="h-6 w-6 text-gray-600"
            />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Email Verification
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Secure Your Account
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We'll send a 6-digit verification code to your email address to
              ensure your account security.
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="otp-input"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              />
            </div>
          </div>

          {/* Proceed Button */}
          <button
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
            onClick={handleProceed}
          >
            Send Verification Code
          </button>
        </div>
      </main>
    </div>
  );
};

export default InputEmail;
