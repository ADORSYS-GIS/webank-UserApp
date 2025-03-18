// PassportForm.tsx
import React from "react";
import { FormContainer, SelectWithPopup, TextInput, DateInput } from "../components/FormComponents";

const PassportForm: React.FC = () => {
    const passportTypes = ["Ordinary Passport", "Diplomatic Passport", "Service Passport"];
    const regions = [
        "Adamawa", "Centre", "East", "Far North", "Littoral",
        "North", "North West", "West", "South", "South West"
    ];

    const handleSubmit = (formData: Record<string, string>) => {
        // Handle passport specific submission
        console.log("Passport Form Data:", formData);
    };

    return (
        <FormContainer title="Passport Information" onSubmit={handleSubmit}>
            <SelectWithPopup
                label="Passport Type"
                options={passportTypes}
                fieldName="passportType"
                placeholder="Select Passport Type"
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
                label="Passport Number"
                fieldName="UniqueDocumentIdentifier"
                placeholder="Enter your passport number"
            />
            <DateInput label="Date of Birth" fieldName="dob" />
            <SelectWithPopup
                label="Current Region"
                options={regions}
                fieldName="region"
                placeholder="Select Region"
            />
            <DateInput label="Expiration Date" fieldName="expiry" />
        </FormContainer>
    );
};

export default PassportForm;