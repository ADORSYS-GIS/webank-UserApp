// IDCardForm.tsx
import React from "react";
import {
  FormContainer,
  SelectWithPopup,
  TextInput,
  DateInput,
} from "../components/FormComponents";

const IDCardForm: React.FC = () => {
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

  const handleSubmit = (formData: Record<string, string>) => {
    // Handle ID card specific submission
    console.log("ID Card Form Data:", formData);
  };

  return (
    <FormContainer title="ID Card Information" onSubmit={handleSubmit}>
      <SelectWithPopup
        label="ID Card Type"
        options={idTypes}
        fieldName="idType"
        placeholder="Select ID Type"
      />
      <TextInput
        label="Full Name"
        fieldName="fullName"
        placeholder="Enter your full name"
      />
      <TextInput
        label="Profession"
        fieldName="profession"
        placeholder="Enter your profession"
      />
      <TextInput
        label="ID Card Number"
        fieldName="UniqueDocumentIdentifier"
        placeholder="Enter your ID card number"
      />
      <DateInput label="Date Of Birth" fieldName="dob" />
      <SelectWithPopup
        label="Current Region"
        options={regions}
        fieldName="region"
        placeholder="Select Region"
      />
      <DateInput label="Expiry Date" fieldName="expiry" />
    </FormContainer>
  );
};

export default IDCardForm;
