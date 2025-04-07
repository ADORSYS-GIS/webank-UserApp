import { useEffect, useState } from "react";
import OtpInput from "../components/OtpInput.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RequestToCreateBankAccount,
  RequestToValidateOTP,
} from "../services/keyManagement/requestService.ts";
import { toast, ToastContainer } from "react-toastify";
import useDisableScroll from "../hooks/useDisableScroll.ts";
import { useDispatch } from "react-redux";
import { setAccountId, setAccountCert } from "../slices/accountSlice";

const Otp = () => {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const otpHash = location.state?.otpHash;
  const fullPhoneNumber = location.state?.fullPhoneNumber;
  const devCert = location.state?.devCert;
  let phoneCert: string;

  const dispatch = useDispatch();

  const handleverifyClick = async () => {
    try {
      if (!otpHash || !fullPhoneNumber) {
        alert("Required data is missing!");
        return;
      }

      const response = await RequestToValidateOTP(
        fullPhoneNumber,
        otp,
        devCert,
      );

      if (response.startsWith("Certificate generated:")) {
        phoneCert = response.split("generated: ")[1];

        console.log(phoneCert);
        try {
          const accountCreationResponse = await RequestToCreateBankAccount(
            fullPhoneNumber,
            devCert,
            phoneCert,
          );

          console.log(accountCreationResponse);
          if (
            accountCreationResponse.startsWith(
              "Bank account successfully created.",
            )
          ) {
            toast.success("Registration successful");

            const accountId = accountCreationResponse.split("\n")[2];
            const accountCert = accountCreationResponse.split("\n")[4];

            console.log("AccountID received:", accountId);
            console.log("AccountCert received:", accountCert);

            // Save to localStorage
            localStorage.setItem("accountId", accountId);
            localStorage.setItem("accountCert", accountCert);

            // Dispatch action to save accountId to the Redux state
            dispatch(setAccountId(accountId));
            dispatch(setAccountCert(accountCert));

            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Navigate to dashboard page
            navigate("/dashboard", { state: { accountId, accountCert } });
          } else {
            toast.error("Account registration failed");
          }
        } catch (error) {
          console.error("Error navigating to dashboard:", error);
        }
      } else {
        toast.error("Phone number Registration failed");
      }
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  // State variables to track minutes and seconds
  const [otp, setOtp] = useState("");
  const onChange = (value: string) => setOtp(value);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);

  // Function to reset the countdown timer when OTP is resent
  const resendOTP = () => {
    setMinutes(1); // Reset minutes to 1
    setSeconds(30); // Reset seconds to 30
  };

  // useEffect to handle the countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Decrease seconds if greater than 0
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      // If seconds reach 0, and minutes are greater than 0, decrease minutes
      else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59); // Reset seconds to 59
      }
    }, 1000); // Set the interval to 1000ms (1 second)

    // Stop the interval when both minutes and seconds reach 0
    if (minutes === 0 && seconds === 0) {
      clearInterval(interval);
    }

    // Cleanup: clear the interval when the component unmounts or when seconds/minutes change
    return () => clearInterval(interval);
  }, [seconds, minutes]); // Removed otp from dependency array as it's not used in effect

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 py-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* OTP Input wrapper with responsive size */}
        <div className="mb-8">
          <OtpInput value={otp} valueLength={5} onChange={onChange} />
        </div>

        {/* Verify button */}
        <div className="w-full mb-6">
          <button
            type="button"
            className="w-full py-3 bg-gradient-to-r from-[#4960F9] to-[#1433FF] text-white font-semibold rounded-3xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4960F9] text-base sm:text-lg hover:bg-[#1433FF] transition duration-300"
            onClick={handleverifyClick}
          >
            Verify Account
          </button>
        </div>

        {/* Timer and Resend section */}
        <div className="flex flex-col items-center space-y-3">
          <p className="text-xs sm:text-sm font-normal text-gray-700 text-center">
            Resend OTP in{" "}
            <span className="font-semibold">
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </p>

          <p className="text-xs sm:text-sm text-gray-700">
            Didn't receive the OTP?{" "}
            <a
              className={`${
                seconds > 0 || minutes > 0 ? "text-gray-400" : "text-blue-500"
              } cursor-${seconds > 0 || minutes > 0 ? "not-allowed" : "pointer"} font-medium`}
              onClick={(e) => {
                if (seconds > 0 || minutes > 0) {
                  e.preventDefault();
                } else {
                  resendOTP();
                }
              }}
              style={{ textDecoration: "none" }}
            >
              Resend OTP
            </a>
          </p>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer/>
    </div>
  );
};

export default Otp;
