// DriverLicenseForm.tsx
import React, { useState } from "react";
import {
  FormContainer,
  SelectWithPopup,
  TextInput,
  DateInput,
} from "../components/FormComponents.tsx";

const DriverLicenseForm: React.FC = () => {
  const [showRegion, setShowRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

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
    <FormContainer title="Driver License Information">
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

      {/* License Number */}
      <TextInput
        label="Driver License Number"
        id="licenseNumber"
        placeholder="Enter your license number"
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
        className="w-full bg-green-500 text-white py-4 rounded-3xl 
                   font-semibold hover:bg-green-600 transition 
                   duration-300 ease-in-out shadow-lg mt-2"
      >
        Submit
      </button>
    </FormContainer>
  );
};

export default DriverLicenseForm;
