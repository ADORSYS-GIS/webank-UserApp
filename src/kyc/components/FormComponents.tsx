import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { RequestToStoreKYCInfo } from "../../services/keyManagement/requestService.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setStatus } from "../../slices/accountSlice.ts";

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
  onCancel?: () => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const accountId = useSelector((state: RootState) => state.account.accountId);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const setFormField: SetFormField = useCallback((fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({ formData, setFormField }),
    [formData, setFormField],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ID Card Form Data:", formData);

    // Extract only the required fields
    const documentNumber = formData["UniqueDocumentIdentifier"];
    const expiry = formData["expiry"];

    console.log("Document Number:", documentNumber, "Expiry Date:", expiry);

    try {
      if (!documentNumber || !expiry || !accountCert || !accountId) {
        toast.error("Please fill in all the required fields");
        return;
      }

      const response = await RequestToStoreKYCInfo(
        documentNumber,
        expiry,
        accountCert,
        accountId,
      );

      if (response === "KYC Info sent successfully and saved.") {
        dispatch(setStatus("PENDING"));
        toast.success("KYC Info sent successfully and saved.");
        navigate("/kyc");
      } else {
        toast.error("Error submitting data, please try again later");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data, please try again later");
    }
    onSubmit(formData);
    setFormData({});
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Call the custom onCancel function if provided
    } else {
      setFormData({}); // Reset the form data
      navigate(-1); // Navigate back to the previous page
    }
  };

  return (
    <FormContext.Provider value={contextValue}>
      <div
        className="max-w-lg mx-auto items-center mt-32 p-4 md:p-6 bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.1)]"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="form-title"
            className="text-2xl font-bold mb-6 text-center text-gray-800"
          >
            {title}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 text-xl focus:outline-none"
            aria-label="Close form"
            title="Close form"
          >
            ×
          </button>
        </div>
        <form
          className="space-y-5"
          aria-labelledby="form-title"
          onSubmit={handleSubmit}
        >
          {children}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-3xl
                     font-semibold transition duration-300 ease-in-out shadow-lg mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </FormContext.Provider>
  );
};

// Keeping SelectWithPopup for reference but not exporting it as default
// You can remove this if not needed elsewhere in your application
const SelectWithPopup: React.FC<{
  label: string;
  options: string[];
  fieldName: string;
  placeholder: string;
}> = ({ label, options, fieldName, placeholder }) => {
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
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-50
                     flex flex-col justify-end md:justify-center items-center p-4"
        >
          <div
            className="w-full md:max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden
                       md:scale-100 transform transition-transform duration-300 ease-in-out md:my-0 my-2"
          >
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

// Re-exporting the components we still need
export { SelectWithPopup };

interface DateInputProps {
  label: string;
  fieldName: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, fieldName }) => {
  const { formData, setFormField } = useContext(FormContext);

  return (
    <div>
      <label htmlFor={fieldName} className="block text-gray-600 text-sm mb-2">
        {label}
      </label>
      <input
        id={fieldName}
        type="text"
        placeholder={`Select ${label}`}
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => (e.target.type = "text")}
        className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] transition duration-200 ease-in-out"
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
      <label htmlFor={fieldName} className="block text-gray-600 text-sm mb-2">
        {label}
      </label>
      <input
        id={fieldName}
        type="text"
        placeholder={placeholder}
        className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] transition duration-200 ease-in-out"
        value={formData[fieldName] || ""}
        onChange={(e) => setFormField(fieldName, e.target.value)}
      />
    </div>
  );
};
