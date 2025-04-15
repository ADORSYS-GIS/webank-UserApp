import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStatus } from "../../slices/accountSlice";
import {
  RequestToSendEmailOTP,
  RequestToVerifyEmailCode,
} from "../../services/keyManagement/requestService";
import { toast, ToastContainer } from "react-toastify";
import OtpInput from "../../components/OtpInput";
import useDisableScroll from "../../hooks/useDisableScroll";

const EmailCode: React.FC = () => {
  useDisableScroll();
  const [otp, setOtp] = useState<string>("".padStart(6, " "));
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, accountCert, accountId } = location.state || {};

  const resendOTP = async () => {
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      try {
        RequestToSendEmailOTP;
        navigate("/emailCode", { state: { email, accountCert } });
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      }
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  const handleVerify = async () => {
    const enteredCode = otp.replace(/\s/g, ""); // Trim spaces
    try {
      const response = await RequestToVerifyEmailCode(
        email,
        enteredCode,
        accountId,
        accountCert,
      );

      if (response === "Webank email verified successfully") {
        dispatch(setStatus("PENDING"));
        setShowSuccess(true);
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white overflow-hidden relative">
      <div className="w-full max-w-md p-6 mx-auto mt-5 rounded-2xl text-center">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/inputEmail")}
            className="text-xl cursor-pointer p-2 focus:outline-none"
            aria-label="Back"
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
        </div>

        {/* Custom Header */}
        <h1 className="text-3xl font-bold mb-3">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        {/* OTP Input Component */}
        <OtpInput
          value={otp}
          valueLength={6}
          onChange={setOtp}
          showHeader={false}
        />

        <p className="text-gray-600 mb-2">
          Didn't receive the code? Click below to resend.
        </p>
        <button
          className="text-[#20B2AA] font-semibold hover:underline mb-6"
          onClick={resendOTP}
        >
          Resend Code
        </button>

        <div className="flex justify-between">
          <button
            className="w-1/3 py-3 bg-gray-300 text-black font-semibold rounded-full shadow-md hover:bg-gray-400 transition"
            onClick={() => navigate("/inputEmail")}
          >
            Back
          </button>
          <button
            className="w-1/3 py-3 bg-[#20B2AA] text-white font-semibold rounded-full shadow-md hover:bg-[#1C8C8A] transition"
            onClick={handleVerify}
          >
            Verify
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-3">
              Successful Email Verification
            </h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified!
            </p>
            <button
              className="py-2 px-6 bg-[#20B2AA] text-white font-semibold rounded-full shadow-md hover:bg-[#1C8C8A] transition"
              onClick={() => navigate("/")}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EmailCode;
