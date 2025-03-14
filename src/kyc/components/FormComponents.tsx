// FormComponents.tsx
import React from "react";

interface SelectWithPopupProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
}

export const SelectWithPopup: React.FC<SelectWithPopupProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder,
  showPopup,
  setShowPopup,
}) => (
  <div className="relative">
    <label className="block text-gray-600 text-sm mb-2">{label}</label>
    <button
      type="button"
      className="w-full p-4 text-left border border-gray-200 rounded-2xl 
                 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] 
                 transition duration-200 ease-in-out"
      onClick={() => setShowPopup(true)}
    >
      {selectedValue || placeholder}
    </button>

    {showPopup && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-50 
                   flex flex-col justify-end md:justify-center items-center p-4"
      >
        <div
          className="w-full md:max-w-md rounded-3xl 
                     bg-white shadow-2xl overflow-hidden 
                     md:scale-100 transform transition-transform 
                     duration-300 ease-in-out md:my-0 my-2"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold">{label}</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                className={`w-full p-4 text-left transition 
                           hover:bg-[#20B2AA]/10 ${
                             selectedValue === option ? "bg-[#20B2AA]/20" : ""
                           }`}
                onClick={() => {
                  onSelect(option);
                  setShowPopup(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="w-full p-4 text-red-500 font-medium 
                       hover:bg-red-50 transition duration-200"
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
);

interface DateInputProps {
  label: string;
  id: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, id }) => (
  <div>
    <label className="block text-gray-600 text-sm mb-2" htmlFor={id}>
      {label}
    </label>
    <input
      type="text"
      id={id}
      placeholder={`Select ${label}`}
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => (e.target.type = "text")}
      className="w-full p-4 border border-gray-200 rounded-2xl 
                 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] 
                 transition duration-200 ease-in-out"
    />
  </div>
);

interface TextInputProps {
  label: string;
  id: string;
  placeholder: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  placeholder,
}) => (
  <div>
    <label className="block text-gray-600 text-sm mb-2" htmlFor={id}>
      {label}
    </label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      className="w-full p-4 border border-gray-200 rounded-2xl 
                 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] 
                 transition duration-200 ease-in-out"
    />
  </div>
);

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
}) => (
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
    <form className="space-y-5" aria-labelledby="form-title">
      {children}
    </form>
  </div>
);
