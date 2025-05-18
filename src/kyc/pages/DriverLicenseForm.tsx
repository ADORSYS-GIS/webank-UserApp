// DriverLicenseForm.tsx
import React from "react";
import {
  FormContainer,
  TextInput,
  DateInput,
} from "../components/FormComponents";

const DriverLicenseForm: React.FC = () => {
  const handleSubmit = (formData: Record<string, string>) => {
    // Handle driver license specific submission
    console.log("Driver License Form Data:", formData);
  };

  return (
    <FormContainer title="Driver License Information" onSubmit={handleSubmit}>
      <TextInput
        label="Driver License Number"
        fieldName="UniqueDocumentIdentifier"
        placeholder="Enter your license number"
      />
      <DateInput label="Expiration Date" fieldName="expiry" />
    </FormContainer>
  );
};

export { DriverLicenseForm as Component };
