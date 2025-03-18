// FormComponents.tsx
import React, { useState, createContext, useContext } from "react";
import {RequestToStoreKYCInfo} from "../../services/keyManagement/requestService.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/Store.ts";

type FormData = Record<string, string>;
type SetFormField = (fieldName: string, value: string) => void;

interface FormContextType {
    formData: FormData;
    setFormField: SetFormField;
}

const FormContext = createContext<FormContextType>({
    formData: {},
    setFormField: () => {},
});

interface FormContainerProps {
    children: React.ReactNode;
    title: string;
    onSubmit: (data: FormData) => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
                                                                children,
                                                                title,
                                                                onSubmit,
                                                            }) => {
    const [formData, setFormData] = useState<FormData>({});
    const accountCert = useSelector(
        (state: RootState) => state.account.accountCert,
    );
    const setFormField: SetFormField = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {

        console.log("ID Card Form Data:", formData);
        //extract data from all fields in formData variable
        const fullName = formData["fullName"];
        const profession = formData["profession"];
        const documentNumber = formData["UniqueDocumentIdentifier"];
        const dob = formData["dob"];
        const region = formData["region"];
        const expiry = formData["expiry"];
        console.log("Full Name:", fullName, "Profession:", profession, "document Number:", documentNumber, "Date of Birth:", dob, "Region:", region, "Expiry Date:", expiry);
        const response = RequestToStoreKYCInfo(fullName, profession, documentNumber, dob, region, expiry, accountCert);
        console.log(response);
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <FormContext.Provider value={{ formData, setFormField }}>
            <div
                className="max-w-lg mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
            >
                <h2
                    id="form-title"
                    className="text-2xl font-bold mb-6 text-center text-gray-800"
                >
                    {title}
                </h2>
                <form className="space-y-5" aria-labelledby="form-title" onSubmit={handleSubmit}>
                    {children}
                    <button
                        type="submit"
                        className="w-full bg-[#20B2AA] text-white py-4 rounded-3xl
                     font-semibold transition duration-300 ease-in-out shadow-lg mt-2"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </FormContext.Provider>
    );
};

interface SelectWithPopupProps {
    label: string;
    options: string[];
    fieldName: string;
    placeholder: string;
}

export const SelectWithPopup: React.FC<SelectWithPopupProps> = ({
                                                                    label,
                                                                    options,
                                                                    fieldName,
                                                                    placeholder,
                                                                }) => {
    const { formData, setFormField } = useContext(FormContext);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="relative">
            <label className="block text-gray-600 text-sm mb-2">{label}</label>
            <button
                type="button"
                className="w-full p-4 text-left border border-gray-200 rounded-2xl
                 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA]
                 transition duration-200 ease-in-out"
                onClick={() => setShowPopup(true)}
            >
                {formData[fieldName] || placeholder}
            </button>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50
                     flex flex-col justify-end md:justify-center items-center p-4">
                    <div className="w-full md:max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden
                       md:scale-100 transform transition-transform duration-300 ease-in-out md:my-0 my-2">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold">{label}</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    className={`w-full p-4 text-left transition hover:bg-[#20B2AA]/10 ${
                                        formData[fieldName] === option ? "bg-[#20B2AA]/20" : ""
                                    }`}
                                    onClick={() => {
                                        setFormField(fieldName, option);
                                        setShowPopup(false);
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button
                            className="w-full p-4 text-red-500 font-medium hover:bg-red-50 transition duration-200"
                            onClick={() => setShowPopup(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface DateInputProps {
    label: string;
    fieldName: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, fieldName }) => {
    const { formData, setFormField } = useContext(FormContext);

    return (
        <div>
            <label className="block text-gray-600 text-sm mb-2">{label}</label>
            <input
                type="text"
                placeholder={`Select ${label}`}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                className="w-full p-4 border border-gray-200 rounded-2xl
                 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA]
                 transition duration-200 ease-in-out"
                value={formData[fieldName] || ""}
                onChange={(e) => setFormField(fieldName, e.target.value)}
            />
        </div>
    );
};

interface TextInputProps {
    label: string;
    fieldName: string;
    placeholder: string;
}

export const TextInput: React.FC<TextInputProps> = ({
                                                        label,
                                                        fieldName,
                                                        placeholder,
                                                    }) => {
    const { formData, setFormField } = useContext(FormContext);

    return (
        <div>
            <label className="block text-gray-600 text-sm mb-2">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full p-4 border border-gray-200 rounded-2xl
                 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA]
                 transition duration-200 ease-in-out"
                value={formData[fieldName] || ""}
                onChange={(e) => setFormField(fieldName, e.target.value)}
            />
        </div>
    );
};