// IDCardForm.tsx
import React from "react";
import {
  FormContainer,
  TextInput,
  DateInput,
} from "../components/FormComponents";

const IDCardForm: React.FC = () => {
  const handleSubmit = (formData: Record<string, string>) => {
    // Handle ID card specific submission
    console.log("ID Card Form Data:", formData);
  };

  return (
    <FormContainer title="ID Card Information" onSubmit={handleSubmit}>
      <TextInput
        label="ID Card Number"
        fieldName="UniqueDocumentIdentifier"
        placeholder="Enter your ID card number"
      />
      <DateInput label="Expiry Date" fieldName="expiry" />
    </FormContainer>
  );
};

export { IDCardForm as Component };
