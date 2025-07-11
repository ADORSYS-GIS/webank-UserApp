import React, { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAccountStore } from "@state/accountStore";
import {
  useEmailOtpServicePostApiPrsEmailOtpSend,
  useEmailOtpServicePostApiPrsEmailOtpValidate,
} from "@openapi/generated/prs/queries/queries";
import { toast } from "sonner";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import OtpInput from "@features/auth/components/OtpInput";

const EmailCode: React.FC = () => {
  useDisableScroll();
  const [otp, setOtp] = useState<string>("".padStart(6, " "));
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useRouterState().location;
  const { email } = location.state as {
    email?: string;
    accountCert?: string;
  };
  const { accountId, setEmailStatus } = useAccountStore();
  const resendEmailMutation = useEmailOtpServicePostApiPrsEmailOtpSend();
  const verifyEmailOtpMutation = useEmailOtpServicePostApiPrsEmailOtpValidate();

  const resendOTP = async () => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      try {
        if (!accountId) {
          toast.error("Account information is missing.");
          navigate({ to: "/" });
          return;
        }
        const result = await resendEmailMutation.mutateAsync({
          requestBody: {
            email,
            accountId,
          },
        });
        if (result?.status === "PENDING") {
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
    navigate({ to: "/" });
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
    if (!accountId || !email) {
      showAccountMissingError();
      return;
    }
    try {
      const result = await verifyEmailOtpMutation.mutateAsync({
        requestBody: {
          email: email || "",
          otpInput: enteredCode,
          accountId,
        },
      });
      if (result?.status === "SUCCESS") {
        setShowSuccess(true);
        setEmailStatus("APPROVED");
      } else {
        showOtpErrorMessage(result?.message ?? "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-0 sm:px-6 md:px-0">
      <div className="">
        <div className="flex items-center mb-4 sm:mb-6 w-full">
          <button
            onClick={() => navigate({ to: "/inputEmail" })}
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-center text-blue-700">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg text-center">
          Enter the 6-digit code sent to your email.
        </p>
        {/* OTP Input Component */}
        <div className="mb-4 sm:mb-6 flex justify-center w-full">
          <OtpInput
            value={otp}
            valueLength={6}
            onChange={setOtp}
            showHeader={false}
          />
        </div>
        <p className="text-gray-600 mb-2 text-sm sm:text-base text-center">
          Didn't receive the code?{" "}
          <span className="block sm:inline">Click below to resend.</span>
        </p>
        <button
          className="text-blue-600 font-semibold hover:underline mb-4 sm:mb-6 text-sm sm:text-base block mx-auto"
          onClick={resendOTP}
        >
          Resend Code
        </button>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mt-2 w-full">
          <button
            className="w-full py-2 sm:w-1/3 sm:py-3 bg-gray-200 text-black font-semibold rounded-full shadow hover:bg-gray-300 transition text-sm sm:text-base border border-gray-300"
            onClick={() => navigate({ to: "/inputEmail" })}
          >
            Back
          </button>
          <button
            className="w-full py-2 sm:w-1/3 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition text-sm sm:text-base border border-blue-500"
            onClick={handleVerify}
          >
            Verify
          </button>
        </div>
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2 sm:px-4">
            <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto border border-gray-100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-2xl sm:text-3xl"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-blue-700">
                Successful Email Verification
              </h2>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Your email has been successfully verified!
              </p>
              <button
                className="py-2 px-4 w-full sm:w-auto sm:px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition text-sm sm:text-base border border-blue-500"
                onClick={() => navigate({ to: "/settings" })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCode;
