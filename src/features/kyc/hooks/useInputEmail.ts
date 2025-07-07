import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { toast } from "sonner";
import { RequestToSendEmailOTP } from "@services/keyManagement/requestService";
import axios from "axios";

export function useInputEmail() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const accountCert = useSelector((state: RootState) => state.account.accountCert);
  const accountId = useSelector((state: RootState) => state.account.accountId);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate account information
  const hasValidAccountInfo = (): boolean => {
    if (!accountId || !accountCert) {
      navigate("/dashboard");
      toast.error("Account information is missing.");
      return false;
    }
    return true;
  };

  // Handle errors from OTP request
  const handleOtpError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        toast.error(
          "This email is not associated with any existing account. Please complete your registration first."
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } else {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleProceed = async (): Promise<void> => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!hasValidAccountInfo()) {
      return;
    }
    try {
      if (!accountId || !accountCert) {
        toast.error("Account information is missing.");
        navigate("/dashboard");
        return;
      }
      const response = await RequestToSendEmailOTP(email, accountCert, accountId);
      if (response.startsWith("OTP sent successfully")) {
        toast.success("OTP sent, please check your email.", { duration: 5000 });
      }
      navigate("/emailCode", { state: { email, accountCert } });
    } catch (error: unknown) {
      handleOtpError(error);
    }
  };

  return {
    email,
    setEmail,
    handleProceed,
  };
}
