import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useDispatch
import {
  RequestToSendEmailOTP,
  RequestToVerifyEmailCode,
} from "../../services/keyManagement/requestService";
import { toast, ToastContainer } from "react-toastify";
import { RootState } from "../../store/Store";

const EmailCode: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, accountCert } = location.state || {};
  const accountId = useSelector((state: RootState) => state.account.accountId);
  console.log(accountId + "Account ID in email page !!!");

  // Generate unique keys for OTP inputs
  const otpKeys = useMemo(
    () => Array.from({ length: 6 }, (_, i) => `otp-${i}`),
    [],
  );

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const resendOTP = async () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email)) {
      try {
        if (!accountId || !accountCert) {
          navigate("/dashboard");
          toast.error("Account information is missing.");
          return;
        }

        await RequestToSendEmailOTP(email, accountCert, accountId);

        navigate("/emailCode", { state: { email, accountCert, accountId } });
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      }
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  const handleVerify = async () => {
    const enteredCode = otp.join("");
    try {
      if (!accountId || !accountCert) {
        navigate("/dashboard");
        toast.error("Account information is missing.");
        return;
      }
      const response = await RequestToVerifyEmailCode(
        email,
        enteredCode,
        accountId,
        accountCert,
      );

      if (response === "Webank email verified successfully") {
        setShowSuccess(true);
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } // Set Redux status to PENDING
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-white overflow-hidden relative"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
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
        <h1 className="text-3xl font-bold mb-3">Verify OTP Code</h1>
        <p className="text-gray-600 mb-6">
          Please enter the OTP code we sent to your email address.
        </p>
        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((data, index) => (
            <input
              key={otpKeys[index]}
              type="text"
              className="w-12 h-12 border border-gray-300 rounded-xl text-center text-2xl focus:ring-2 focus:ring-[#20B2AA] focus:outline-none"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
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
          <div
            className="bg-white p-6 rounded-xl shadow-lg text-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
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
