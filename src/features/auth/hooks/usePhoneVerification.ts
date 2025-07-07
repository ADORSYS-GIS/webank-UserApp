import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RequestToSendOTP, RequestToValidateOTP } from "@services/keyManagement/requestService.ts";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPhoneStatus } from "@state/accountSlice.ts";
import { RootState } from "@state/Store.ts";

export function usePhoneVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { otpHash: initialOtpHash, fullPhoneNumber } = location.state ?? {};
  const [otpHash, setOtpHash] = useState(initialOtpHash);
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const accountJwt = useSelector((state: RootState) => state.account.accountCert);

  const handleResendOTP = async () => {
    if (!fullPhoneNumber) {
      toast.error("Required data is missing. Please try again.");
      return;
    }
    if (!accountJwt) {
      toast.error("Authentication error. Please try again.");
      return;
    }
    try {
      const newOtpHash = await RequestToSendOTP(fullPhoneNumber, accountJwt);
      setOtpHash(newOtpHash);
      setOtp("");
      setMinutes(1);
      setSeconds(30);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyClick = async () => {
    try {
      if (!otpHash || !fullPhoneNumber) {
        toast.info("Required data is missing!");
        return;
      }
      if (!accountJwt) {
        toast.error("Authentication error. Please try again.");
        return;
      }
      const response = await RequestToValidateOTP(fullPhoneNumber, otp, accountJwt);
      if (response.startsWith("Otp Validated Successfully")) {
        toast.success("Phone number successfully verified!");
        dispatch(setPhoneStatus("APPROVED"));
        setTimeout(() => navigate("/settings"), 2000);
      } else {
        toast.error("The code is invalid", { duration: 5000 });
      }
    } catch (error) {
      toast.error("Failed to validate OTP. Please try again.");
    }
  };

  return {
    otpHash,
    setOtpHash,
    otp,
    setOtp,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    handleResendOTP,
    handleVerifyClick,
  };
}
