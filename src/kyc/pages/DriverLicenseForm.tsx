// DriverLicenseForm.tsx
import React from "react";
import { FormContainer, SelectWithPopup, TextInput, DateInput } from "../components/FormComponents";

const DriverLicenseForm: React.FC = () => {
    const regions = [
        "Adamawa", "Centre", "East", "Far North", "Littoral",
        "North", "North West", "West", "South", "South West"
    ];

    const handleSubmit = (formData: Record<string, string>) => {
        // Handle driver license specific submission
        console.log("Driver License Form Data:", formData);
    };

    return (
        <FormContainer title="Driver License Information" onSubmit={handleSubmit}>
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
                label="Driver License Number"
                fieldName="UniqueDocumentIdentifier"
                placeholder="Enter your license number"
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

export default DriverLicenseForm;