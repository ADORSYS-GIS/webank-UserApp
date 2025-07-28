import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import { useAccountStore } from "@state/accountStore";
import { toast } from "sonner";
import { ChevronLeft, Mail } from "react-feather";
import axios from "axios";
import { useEmailOtpServicePostApiPrsEmailOtpSend } from "@openapi/generated/prs/queries/queries";

const InputEmail: React.FC = () => {
  useDisableScroll();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { accountId, accountCert } = useAccountStore();
  const emailMutation = useEmailOtpServicePostApiPrsEmailOtpSend();

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate account information
  const hasValidAccountInfo = (): boolean => {
    if (!accountId || !accountCert) {
      navigate({ to: "/" });
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
          "This email is not associated with any existing account. Please complete your registration first.",
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
      if (!accountId) {
        toast.error("Account information is missing.");
        navigate({ to: "/" });
        return;
      }
      const result = await emailMutation.mutateAsync({
        requestBody: {
          email,
          accountId,
        },
      });
      if (result?.status) {
        toast.success("OTP sent, please check your email.", { duration: 5000 });
      }
      navigate({ to: "/emailCode", state: { email, accountCert } as never });
    } catch (error: unknown) {
      handleOtpError(error);
    }
  };

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-6 max-w-2xl mx-auto flex flex-col relative overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Enhanced Header */}
      <button
        type="button"
        onClick={() => navigate({ to: "/settings" })}
        className="absolute top-6 left-4 md:left-6 flex items-center space-x-2 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:text-blue-500 transition-colors" />
        <span className="text-gray-600 group-hover:text-blue-500 transition-colors text-sm font-medium">
          Back
        </span>
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 pt-10 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <img
              src="/secure.jpg"
              alt="Email Verification"
              className="w-20 h-20 rounded-full object-cover shadow-lg"
            />
          </div>
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Email Verification
            </h1>
            <p className="text-gray-600 leading-relaxed">
              We'll send a 6-digit verification code to your email address to
              ensure your account security.
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-4 mt-8">
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Proceed Button */}
          <div className="mt-8">
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100"
              onClick={handleProceed}
            >
              Send Verification Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InputEmail;
