import { useEffect, useState } from "react";
import OtpInput from "../components/OtpInput.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RequestToCreateBankAccount,
  RequestToValidateOTP,
  RequestToSendOTP,
} from "../services/keyManagement/requestService.ts";
import { toast } from "sonner";
import useDisableScroll from "../hooks/useDisableScroll.ts";
import { useDispatch } from "react-redux";
import { setAccountId, setAccountCert } from "../slices/accountSlice";

const Otp = () => {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state from location
  const {
    otpHash: initialOtpHash,
    fullPhoneNumber,
    devCert,
  } = location.state ?? {};
  const [otpHash, setOtpHash] = useState(initialOtpHash);
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const dispatch = useDispatch();

  const handleResendOTP = async () => {
    if (!fullPhoneNumber || !devCert) {
      toast.error("Required data is missing. Please try again.");
      return;
    }

    try {
      const newOtpHash = await RequestToSendOTP(fullPhoneNumber, devCert);
      setOtpHash(newOtpHash);
      setOtp(""); // Clear current OTP input
      setMinutes(1); // Reset timer
      setSeconds(30);
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyClick = async () => {
    try {
      if (!otpHash || !fullPhoneNumber) {
        toast.info("Required data is missing!");
        return;
      }

      const response = await RequestToValidateOTP(
        fullPhoneNumber,
        otp,
        devCert,
      );

      if (response.startsWith("Certificate generated:")) {
        const phoneCert = response.split("generated: ")[1];

        const accountCreationResponse = await RequestToCreateBankAccount(
          fullPhoneNumber,
          devCert,
          phoneCert,
        );

        if (
          accountCreationResponse.startsWith(
            "Bank account successfully created.",
          )
        ) {
          toast.success("Registration successful");

          const accountId = accountCreationResponse.split("\n")[2];
          const accountCert = accountCreationResponse.split("\n")[4];

          localStorage.setItem("accountId", accountId);
          localStorage.setItem("accountCert", accountCert);
          dispatch(setAccountId(accountId));
          dispatch(setAccountCert(accountCert));

          setTimeout(
            () =>
              navigate("/onboarding", {
                state: { accountId, accountCert },
              }),
            2000,
          );
        } else {
          toast.error("Account registration failed");
        }
      } else {
        toast.error("The code is invalid", { duration: 5000 });
      }
    } catch (error) {
      console.error("Error during OTP validation:", error);
      toast.error("Phone number registration failed");
    }
  };

  // Timer useEffect (unchanged)
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
    <div className="flex flex-col justify-center items-center min-h-screen px-4 py-6 sm:py-10">
      <div className="w-full max-w-md">
        <OtpInput value={otp} valueLength={5} onChange={setOtp} />

        <button
          onClick={handleVerifyClick}
          className="w-full py-3 bg-gradient-to-r from-[#4960F9] to-[#1433FF] text-white font-semibold rounded-3xl shadow-md..."
        >
          Verify code
        </button>

        <div className="flex flex-col items-center space-y-3">
          <p className="text-xs sm:text-sm font-normal text-gray-700 text-center mt-4">
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
  );
};

export default Otp;
