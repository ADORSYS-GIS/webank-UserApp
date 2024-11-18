import React, { useState } from "react";
import WebankLogo from "../assets/Webank.png";
import countryOptions from "../assets/countries.json";
import parsePhoneNumberFromString from "libphonenumber-js";
import { PHONE_NUMBER_REGEX } from "../constants.ts";
import { sendOtpWithKeyManagement } from "../services/keyManagement/registerService.ts";
import { useNavigate } from "react-router-dom";

type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

const Register: React.FC = () => {
   const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions[0],
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to control dropdown visibility
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to handle search input

  // Filter the country options based on the search term
  const filteredCountries = countryOptions.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCountryChange = (option: CountryOption) => {
    setSelectedCountry(option);
    setIsOpen(false); // Close the dropdown when a country is selected
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    // Use the imported regex constant for validation
    if (PHONE_NUMBER_REGEX.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a phone number."); // Notify user if phone number is empty
      return;
    }

    const fullPhoneNumber = selectedCountry?.value + phoneNumber;
    const phoneNumberObj = parsePhoneNumberFromString(fullPhoneNumber);

    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      alert("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true); // Set loading state
    try {
      await sendOtpWithKeyManagement(phoneNumber);
      await sendOTP(fullPhoneNumber);
      alert("OTP sent!");
      navigate("/otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to handle the actual OTP sending logic (implement as needed)
  const sendOTP = async (phoneNumber: string) => {
    console.log("OTP sent to:", phoneNumber);
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
              style={{ height: "48px" }} // Ensure height matches input
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
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
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
            pattern="[0-9]*" // Regex pattern to allow only numbers
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
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Sending..." : "Send OTP"} {/* Show loading text */}
        </button>
      </div>
    </div>
  );
};

export default Register;
