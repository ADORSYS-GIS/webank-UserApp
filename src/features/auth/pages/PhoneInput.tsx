import React from "react";
import useDisableScroll from "@shared/hooks/useDisableScroll.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePhoneInput } from "../hooks/usePhoneInput";
import countryOptions from "@assets/countries.json";

type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

const PhoneInput: React.FC = () => {
  useDisableScroll();
  const {
    selectedCountry,
    phoneNumber,
    isOpen,
    searchTerm,
    setSearchTerm,
    isLoading,
    handleCountryChange,
    toggleDropdown,
    handlePhoneNumberChange,
    handleSendOTP,
  } = usePhoneInput();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-20 lg:py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => window.history.back()}
              className="text-xl cursor-pointer p-2 focus:outline-none"
              aria-label="Back"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="h-6 w-6 text-gray-600"
              />
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
                    onClick={toggleDropdown}
                  >
                    <div className="flex items-center">
                      <img
                        src={selectedCountry?.flag}
                        alt=""
                        className="w-6 h-4 mr-2"
                      />
                      <span>{selectedCountry?.value}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-64 overflow-auto">
                      <input
                        type="text"
                        placeholder="Search Country"
                        className="w-full p-2 border-b focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {countryOptions.map((option: CountryOption) => (
                        <button
                          key={option.value}
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCountryChange(option)}
                        >
                          <img
                            src={option.flag}
                            alt=""
                            className="w-6 h-4 mr-2"
                          />
                          <span>
                            {option.label} ({option.value})
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  pattern="[0-9]*"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="flex-1 p-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
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
