import React, { useState } from "react";
import WebankLogo from "../assets/Webank.png";
import countryOptions from "../assets/countries.json";
import parsePhoneNumberFromString from "libphonenumber-js";
import { PHONE_NUMBER_REGEX } from "../constants.ts";
import { RequestToSendOTP } from "../services/keyManagement/requestService.ts";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions[0],
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredCountries = countryOptions.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCountryChange = (option: CountryOption) => {
    setSelectedCountry(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    if (PHONE_NUMBER_REGEX.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }

    const fullPhoneNumber = selectedCountry?.value + phoneNumber;
    const phoneNumberObj = parsePhoneNumberFromString(fullPhoneNumber);

    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      setIsLoading(true);
      const otpHash = await RequestToSendOTP(fullPhoneNumber);
      toast.success("OTP sent!");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigate("/otp", { state: { otpHash, fullPhoneNumber } });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 lg:px-20 lg:py-10">
      <div className="mt-70">
        <img
          src={WebankLogo}
          alt="WeBank Logo"
          className="w-auto h-60 lg:w-60 -mt-10"
        />
      </div>

      <div className="text-center mt-6">
        <h1 className="text-xl font-bold lg:text-2xl">
          Register for a bank account
        </h1>
        <p className="text-gray-500 lg:text-lg">
          Please enter your phone number
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm lg:max-w-md">
        <label htmlFor="phone" className="block text-left font-medium">
          Phone Number
        </label>
        <div className="flex mt-2 items-center">
          <div className="relative w-1/3">
            <div
              className="flex items-center justify-between cursor-pointer border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleDropdown}
              style={{ height: "48px" }}
            >
              <div className="flex items-center">
                <img
                  src={selectedCountry?.flag}
                  alt=""
                  className="w-6 h-4 mr-2"
                />
                <span>{selectedCountry?.value}</span>
              </div>
              <span className="material-icons">arrow_drop_down</span>
            </div>

            {isOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-64 overflow-auto">
                <input
                  type="text"
                  placeholder="Search Country"
                  className="w-full p-2 border-b focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredCountries.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCountryChange(option)}
                  >
                    <img src={option.flag} alt="" className="w-6 h-4 mr-2" />
                    <span>
                      {option.label} ({option.value})
                    </span>
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="p-2 text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          <input
            type="tel"
            pattern="[0-9]*"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:text-lg"
            required
          />
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm lg:max-w-md">
        <button
          type="button"
          onClick={handleSendOTP}
          className="w-full py-3 bg-gradient-to-r from-[#4960F9] to-[#1433FF] text-white font-semibold rounded-3xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4960F9] lg:text-lg hover:bg-[#1433FF] transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Register;
