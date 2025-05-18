import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setEmailStatus } from "../../slices/account.slice.ts";
import {
  RequestToSendEmailOTP,
  RequestToVerifyEmailCode,
} from "../../services/keyManagement/requestService";
import { toast } from "sonner";
import OtpInput from "../../components/OtpInput";
import useDisableScroll from "../../hooks/useDisableScroll";
import { AppDispatch, RootState } from '../../store/Store';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios for error handling

const EmailCode: React.FC = () => {
  useDisableScroll();
  const [otp, setOtp] = useState<string>("".padStart(6, " "));
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, accountCert } = location.state ?? {};
  const accountId = useSelector((state: RootState) => state.account.accountId);

  const resendOTP = async () => {
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      try {
        if (!accountId || !accountCert) {
          toast.error("Account information is missing.");
          navigate("/");
          return;
        }
        const response = await RequestToSendEmailOTP(
          email,
          accountCert,
          accountId,
        );

        if (response.startsWith("OTP sent successfully")) {
          toast.success("OTP Resend, please check your email.", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error resending OTP:", error);
        toast.error("Failed to resend OTP. Please try again.");
      }
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  const showAccountMissingError = () => {
    toast.error("Account information is missing.");
    navigate("/");
  };

  const showOtpErrorMessage = (message: string) => {
    switch (message) {
      case "Webank OTP expired":
        toast.error("OTP has expired. Please request a new one.");
        break;
      case "User record not found":
        toast.error("User not found. Please try again.");
        break;
      case "OTP expiration date missing":
        toast.error("OTP is invalid. Please request a new one.");
        break;
      default:
        toast.error("Failed to verify OTP. Please try again.");
        break;
    }
  };

  const handleVerify = async () => {
    const enteredCode = otp.replace(/\s/g, ""); // Trim spaces
    if (enteredCode.length !== 6 || !/^\d{6}$/.test(enteredCode)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      if (!accountId || !accountCert) {
        showAccountMissingError();
        return;
      }

      const response = await RequestToVerifyEmailCode(
        email,
        enteredCode,
        accountId,
        accountCert,
      );

      if (response === "Webank email verified successfully") {
        dispatch(setEmailStatus("APPROVED"));
        setShowSuccess(true);
      } else if (response === "Invalid Webank OTP") {
        toast.error("Invalid OTP. Please try again.");
      } else {
        toast.error("OTP validation failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data;
        showOtpErrorMessage(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
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
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="h-6 w-6 text-gray-600"
            />
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
          className="text-blue-500 font-semibold hover:underline mb-6"
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
            className="w-1/3 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition"
            onClick={handleVerify}
          >
            Verify
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Successful Email Verification
            </h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified!
            </p>
            <button
              className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition"
              onClick={() => navigate("/")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { EmailCode as Component };
