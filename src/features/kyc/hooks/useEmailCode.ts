import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEmailStatus } from "@state/accountSlice";
import {
  RequestToSendEmailOTP,
  RequestToVerifyEmailCode,
} from "@services/keyManagement/requestService";
import { toast } from "sonner";
import { RootState } from "@state/Store";
import axios from "axios";

export function useEmailCode() {
  useDisableScroll();
  const [otp, setOtp] = useState<string>("".padStart(6, " "));
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, accountCert } = location.state ?? {};
  const accountId = useSelector((state: RootState) => state.account.accountId);

  const resendOTP = async () => {
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      try {
        if (!accountId || !accountCert) {
          toast.error("Account information is missing.");
          navigate("/dashboard");
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
    navigate("/dashboard");
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

  return {
    otp,
    setOtp,
    showSuccess,
    handleVerify,
    resendOTP,
    navigate,
    setShowSuccess,
  };
}
import useDisableScroll from "@shared/hooks/useDisableScroll";
