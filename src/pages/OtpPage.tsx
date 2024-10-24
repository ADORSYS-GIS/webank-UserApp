import { useEffect, useState } from "react";
import OtpInput from "../components/OtpInput.tsx";

const Otp = () => {
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
  }, [seconds, minutes]); // Dependency array ensures the effect re-runs when 'seconds' or 'minutes' change

  return (
    <div className="container">
      <h1>OTP Verification</h1>
      <h4>Enter the verification code we just sent to your phone number</h4>
      {/* Render the OTP input */}
      <OtpInput value={otp} valueLength={4} onChange={onChange} />
      <div className="countdown-text">
        <p>
          {/* Display countdown timer in mm:ss format */}
          Resend OTP in{" "}
          <span style={{ fontWeight: 600 }}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
        <div className="countdown-wrapper">
          <p>Didn't receive the OTP?</p>
          <button
            disabled={seconds > 0 || minutes > 0}
            style={{
              color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#007FFF",
              cursor: seconds > 0 || minutes > 0 ? "not-allowed" : "pointer",
            }}
            onClick={resendOTP}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
