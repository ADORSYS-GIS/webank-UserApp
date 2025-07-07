import { useState } from "react";
import countryOptions from "@assets/countries.json";
import parsePhoneNumberFromString from "libphonenumber-js";
import { PHONE_NUMBER_REGEX } from "@shared/constants.ts";
import { RequestToSendOTP } from "@services/keyManagement/requestService.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store.ts";

type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

export function usePhoneInput() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(countryOptions[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accountJwt = useSelector((state: RootState) => state.account.accountCert);

  const handleCountryChange = (option: CountryOption) => {
    setSelectedCountry(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!accountJwt) {
      toast.error("Authentication error. Please try again.");
      return;
    }
    const fullPhoneNumber = selectedCountry?.value + phoneNumber;
    const phoneNumberObj = parsePhoneNumberFromString(fullPhoneNumber);
    if (!phoneNumberObj?.isValid()) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    localStorage.setItem("phoneNumber", phoneNumber);
    setIsLoading(true);
    try {
      const otpHash = await RequestToSendOTP(fullPhoneNumber, accountJwt);
      if (otpHash.includes("exists")) {
        toast.error("Phone number already registered.");
      } else {
        toast.info("One-time code sent. Please check your whatsapp.", { duration: 5000 });
        navigate("/verify", { state: { otpHash, fullPhoneNumber } });
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedCountry,
    setSelectedCountry,
    phoneNumber,
    setPhoneNumber,
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    isLoading,
    setIsLoading,
    handleCountryChange,
    toggleDropdown,
    handlePhoneNumberChange,
    handleSendOTP,
  };
}
