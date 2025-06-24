import React, { useState } from "react";
import countryOptions from "../assets/countries.json";
import parsePhoneNumberFromString from "libphonenumber-js";
import { PHONE_NUMBER_REGEX } from "../constants.ts";
import { RequestToSendOTP } from "../services/keyManagement/requestService.ts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import useDisableScroll from "../hooks/useDisableScroll.ts";
import { ArrowLeft } from "react-feather";
import { RootState } from "../store/Store.ts";

type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

const PhoneInput: React.FC = () => {
  useDisableScroll();
  const [selectedCountry] = useState<CountryOption>(countryOptions[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  const handleProceed = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }

    if (!accountCert) {
      toast.error("Authentication error. Please try again.");
      return;
    }

    const fullPhoneNumber = selectedCountry.value + phoneNumber;
    const phoneNumberObj = parsePhoneNumberFromString(fullPhoneNumber);

    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      const otpHash = await RequestToSendOTP(fullPhoneNumber, accountCert);

      if (otpHash.includes("exists")) {
        toast.error("This phone number is already registered.");
        return;
      }

      if (otpHash.includes("OTP sent successfully")) {
        toast.success("OTP sent successfully!", { duration: 5000 });
        navigate("/phoneVerification", {
          state: { phoneNumber: fullPhoneNumber, accountCert },
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-20 lg:py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/settings")}
              className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Verify Your Phone Number
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We'll send a 5-digit verification code to your WhatsApp number to
              ensure your account security.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="flex items-center">
                <div className="relative w-1/3">
                  <button
                    className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <img
                        src={selectedCountry.flag}
                        alt=""
                        className="w-6 h-4 mr-2"
                      />
                      <span>{selectedCountry.label}</span>
                    </div>
                  </button>
                </div>

                <input
                  type="tel"
                  pattern="[0-9]*"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (PHONE_NUMBER_REGEX.test(value)) {
                      setPhoneNumber(value);
                    }
                  }}
                  className="flex-1 p-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
