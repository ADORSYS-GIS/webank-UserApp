// PassportForm.tsx
import React, { useState } from "react";
import {
  FormContainer,
  SelectWithPopup,
  TextInput,
  DateInput,
} from "../components/FormComponents.tsx";

const PassportForm: React.FC = () => {
  const [showPassportType, setShowPassportType] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [showRegion, setShowRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

  const passportTypes = [
    "Ordinary Passport",
    "Diplomatic Passport",
    "Service Passport",
  ];
  const regions = [
    "Adamawa",
    "Centre",
    "East",
    "Far North",
    "Littoral",
    "North",
    "North West",
    "West",
    "South",
    "South West",
  ];

  return (
    <FormContainer title="Passport Information">
      {/* Passport Type Selection */}
      <SelectWithPopup
        label="Passport Type"
        options={passportTypes}
        selectedValue={selectedType}
        onSelect={setSelectedType}
        placeholder="Select Passport Type"
        showPopup={showPassportType}
        setShowPopup={setShowPassportType}
      />

      {/* Full Name */}
      <TextInput
        label="Full Name"
        id="fullName"
        placeholder="Enter your full name"
      />

      {/* Profession */}
      <TextInput
        label="Profession"
        id="profession"
        placeholder="Enter your profession"
      />

      {/* Passport Number */}
      <TextInput
        label="Passport Number"
        id="passportNumber"
        placeholder="Enter your passport number"
      />

      {/* Date of Birth */}
      <DateInput label="Date of Birth" id="dob" />

      {/* Current Region */}
      <SelectWithPopup
        label="Current Region"
        options={regions}
        selectedValue={selectedRegion}
        onSelect={setSelectedRegion}
        placeholder="Select Region"
        showPopup={showRegion}
        setShowPopup={setShowRegion}
      />

      {/* Expiration Date */}
      <DateInput label="Expiration Date" id="expiry" />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#20B2AA] text-white py-4 rounded-3xl 
                   font-semibold transition 
                   duration-300 ease-in-out shadow-lg mt-2"
      >
        Submit
      </button>
    </FormContainer>
  );
};

export default PassportForm;
