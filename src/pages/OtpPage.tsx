import { useEffect, useState } from "react";
import OtpInput from "../components/OtpInput.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getKey } from "../services/keyManagement/registerService.ts";
import { PhoneNumber } from "libphonenumber-js";

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleverifyClick = async () => {
    try {
      const otpHash = location.state?.otpHash;
      const publicKey = getKey();
      const fullPhoneNumber = location.state?.fullPhoneNumber;

      if (!otpHash || !fullPhoneNumber) {
        alert("Required data is missing!");
        return;
      }

      console.log(otpHash);
      console.log(fullPhoneNumber, publicKey, otp, otpHash);

      const response = await axios.post("http://localhost:8080/api/otp/validate", {
        phoneNumber: fullPhoneNumber,
        publicKey: publicKey,
        otpInput: otp,
        otpHash: otpHash,
      });

      console.log(response);
      if (response.data === true) {
        alert("OTP Verified");
        navigate("/dashboard");
      } else {
        alert("Invalid OTP");
        console.log(response);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP");
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
        otp;
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
  }, [seconds, minutes, otp]); // Dependency array ensures the effect re-runs when 'seconds' or 'minutes' change

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-10">
      {/* Render the OTP input */}
      <OtpInput value={otp} valueLength={4} onChange={onChange} />

      <div className="mx-auto mt-10 w-full max-w-xs lg:max-w-md">
        <button
          type="button"
          className="w-full py-3 bg-gradient-to-r from-[#4960F9] to-[#1433FF] text-white font-semibold rounded-3xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4960F9] lg:text-lg hover:bg-[#1433FF] transition duration-300"
          onClick={handleverifyClick}
        >
          Verify Account
        </button>
      </div>

      <div className="flex flex-col items-center mt-5 mb-5">
        <p className="text-[13px] font-normal text-[#2d1d35] mb-5 text-center">
          Resend OTP in{" "}
          <span className="font-semibold">
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
        <div className="countdown-wrapper">
          <p>
            Didn't you receive the OTP?{" "}
            <a
              className={`${
                seconds > 0 || minutes > 0 ? "text-gray-400" : "text-blue-500"
              } cursor-${seconds > 0 || minutes > 0 ? "not-allowed" : "pointer"}`}
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
    </div>
  );
};

export default Otp;
