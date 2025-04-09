// PassportForm.tsx
import React from "react";
import {
  FormContainer,
  TextInput,
  DateInput,
} from "../components/FormComponents";

const PassportForm: React.FC = () => {
  const handleSubmit = (formData: Record<string, string>) => {
    // Handle passport specific submission
    console.log("Passport Form Data:", formData);
  };

  return (
    <FormContainer title="Passport Information" onSubmit={handleSubmit}>
      <TextInput
        label="Passport Number"
        fieldName="UniqueDocumentIdentifier"
        placeholder="Enter your passport number"
      />
      <DateInput label="Expiration Date" fieldName="expiry" />
    </FormContainer>
  );
};

export default PassportForm;