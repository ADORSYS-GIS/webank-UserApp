import React, { useEffect, useState } from "react";
import OtpInput from "../components/OtpInput.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RequestToSendOTP,
  RequestToValidateOTP,
} from "../services/keyManagement/requestService.ts";
import { toast } from "sonner";
import useDisableScroll from "../hooks/useDisableScroll.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAccountStore } from "../store/accountStore";

const PhoneVerification: React.FC = () => {
  useDisableScroll();
  const [otp, setOtp] = useState<string>("".padStart(5, " "));
  const { setPhoneStatus } = useAccountStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { otpHash: initialOtpHash, fullPhoneNumber } = location.state ?? {};
  const [otpHash, setOtpHash] = useState(initialOtpHash);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);

  const handleResendOTP = async () => {
    if (!fullPhoneNumber) {
      toast.error("Required data is missing. Please try again.");
      return;
    }

    try {
      const accountCert = useAccountStore.getState().accountCert;
      if (!accountCert) {
        toast.error("Authentication error. Please try again.");
        return;
      }

      const newOtpHash = await RequestToSendOTP(fullPhoneNumber, accountCert);
      setOtpHash(newOtpHash);
      setOtp("".padStart(5, " ")); // Clear current OTP input
      setMinutes(1); // Reset timer
      setSeconds(30);
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerify = async () => {
    const enteredCode = otp.replace(/\s/g, ""); // Trim spaces
    if (enteredCode.length !== 5 || !/^\d{5}$/.test(enteredCode)) {
      toast.error("Please enter a valid 5-digit OTP.");
      return;
    }

    try {
      if (!fullPhoneNumber || !otpHash) {
        toast.error("Phone verification data is missing.");
        return;
      }

      const response = await RequestToValidateOTP(
        fullPhoneNumber,
        enteredCode,
        otpHash,
      );

      if (response === "Webank OTP verified successfully") {
        setPhoneStatus("APPROVED");
        setTimeout(() => navigate("/settings"), 2000);
      } else if (response === "Invalid Webank OTP") {
        toast.error("Invalid OTP. Please try again.");
      } else {
        toast.error("OTP validation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // Timer useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-20 lg:py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-xl cursor-pointer p-2 focus:outline-none"
              aria-label="Back"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="h-6 w-6 text-gray-600"
              />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Verify Your Phone Number
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enter the 5-digit verification code sent to your WhatsApp number.
            </p>
          </div>

          <div className="space-y-6">
            <OtpInput
              value={otp}
              valueLength={5}
              onChange={setOtp}
              showHeader={false}
            />

            <button
              onClick={handleVerify}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
            >
              Verify Code
            </button>

            <div className="flex flex-col items-center space-y-3">
              <p className="text-xs sm:text-sm font-normal text-gray-700 text-center">
                Resend code in{" "}
                <span className="font-semibold">
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  disabled={minutes > 0 || seconds > 0}
                  className={`${
                    minutes > 0 || seconds > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-500 cursor-pointer"
                  } font-medium text-xs sm:text-sm`}
                  onClick={() => {
                    if (minutes === 0 && seconds === 0) handleResendOTP();
                  }}
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
