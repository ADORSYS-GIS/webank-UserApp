import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDisableScroll from "../../hooks/useDisableScroll";
import { RequestToSendEmailOTP } from "../../services/keyManagement/requestService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";

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
      className="h-screen flex flex-col bg-white overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header with back button */}
      <header className="p-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 focus:outline-none"
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </header>

      {/* Main content - contained for desktop */}
      <main className="flex-grow flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl md:shadow-md md:p-8 md:my-8">
          <h1 className="text-2xl font-bold mb-2">Email Verification</h1>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Please enter a valid email address to receive a 6-digit code.
          </p>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="block w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#20B2AA] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Desktop-only proceed button */}
          <div className="hidden md:block">
            <button
              className="w-full py-3 bg-[#20B2AA] text-white font-semibold rounded-full shadow-md hover:bg-[#1C8C8A] transition"
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      </main>

      {/* Mobile-only footer with proceed button */}
      <footer className="p-4 md:hidden">
        <div className="max-w-md mx-auto">
          <button
            className="w-full py-3 bg-[#20B2AA] text-white font-semibold rounded-full shadow-md hover:bg-[#1C8C8A] transition"
            onClick={handleProceed}
          >
            Proceed
          </button>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default InputEmail;
