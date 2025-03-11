// IDCardForm.tsx
import React, { useState } from "react";
import {
  FormContainer,
  SelectWithPopup,
  TextInput,
  DateInput,
} from "../components/FormComponents.tsx";

const IDCardForm: React.FC = () => {
  const [showIDType, setShowIDType] = useState(false);
  const [selectedID, setSelectedID] = useState("");
  const [showRegion, setShowRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

  const idTypes = ["Original ID", "Receipt ID"];
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

  // IDCardForm.tsx
  return (
    <FormContainer title="ID Card Information">
      {/* Add actual form components here */}
      <SelectWithPopup
        label="ID Card Type"
        options={idTypes}
        selectedValue={selectedID}
        onSelect={setSelectedID}
        placeholder="Select ID Type"
        showPopup={showIDType}
        setShowPopup={setShowIDType}
      />
      <TextInput
        label="Full Name"
        id="fullName"
        placeholder="Enter your full name"
      />
      <TextInput
        label="Profession"
        id="profession"
        placeholder="Enter your profession"
      />
      <TextInput
        label="ID Card Number"
        id="idNumber"
        placeholder="Enter your ID card number"
      />
      <DateInput label="Date Of Birth" id="dob" />
      <SelectWithPopup
        label="Current Region"
        options={regions}
        selectedValue={selectedRegion}
        onSelect={setSelectedRegion}
        placeholder="Select Region"
        showPopup={showRegion}
        setShowPopup={setShowRegion}
      />
      <DateInput label="Expiry Date" id="expiry" />
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

export default IDCardForm;
