import React, { useState } from "react";
import {
    FormContainer,
    SelectWithPopup,
    TextInput,
    DateInput,
} from "../components/FormComponents.tsx";
import {RequestToStoreIDCardInfo} from "../../services/keyManagement/requestService.ts";

const IDCardForm: React.FC = () => {
    const [showIDType, setShowIDType] = useState(false);
    const [selectedID, setSelectedID] = useState("");
    const [showRegion, setShowRegion] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [fullName, setFullName] = useState("");
    const [profession, setProfession] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [dob, setDob] = useState("");
    const [expiry, setExpiry] = useState("");

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName || !profession || !idNumber || !dob || !selectedRegion || !expiry) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            await RequestToStoreIDCardInfo(
                fullName,
                profession,
                idNumber,
                dob,
                selectedRegion,
                expiry,
                null
            );
            alert("ID Card information submitted successfully");
        } catch (error) {
            alert("Failed to submit ID Card information. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormContainer title="ID Card Information">
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <TextInput
                    label="Profession"
                    id="profession"
                    placeholder="Enter your profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                />
                <TextInput
                    label="ID Card Number"
                    id="idNumber"
                    placeholder="Enter your ID card number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                />
                <DateInput
                    label="Date Of Birth"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
                <SelectWithPopup
                    label="Current Region"
                    options={regions}
                    selectedValue={selectedRegion}
                    onSelect={setSelectedRegion}
                    placeholder="Select Region"
                    showPopup={showRegion}
                    setShowPopup={setShowRegion}
                />
                <DateInput
                    label="Expiry Date"
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-[#20B2AA] text-white py-4 rounded-3xl
                       font-semibold transition duration-300 ease-in-out shadow-lg mt-2"
                >
                    Submit
                </button>
            </FormContainer>
        </form>
    );
};

export default IDCardForm;