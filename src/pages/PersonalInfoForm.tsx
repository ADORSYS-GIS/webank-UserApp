import React, { useState } from "react";

const PersonalInfoForm: React.FC = () => {
  const [showIDType, setShowIDType] = useState(false);
  const [selectedID, setSelectedID] = useState("Original ID");
  const [showRegion, setShowRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Select Region");

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

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Personal Information
      </h2>
      <form className="space-y-5">
        {/* ID Type Selection */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-2" htmlFor="idType">
            ID Card Type
          </label>
          <button
            type="button"
            id="idType"
            className="w-full p-4 text-left border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
            onClick={() => setShowIDType(true)}
          >
            {selectedID}
          </button>
        </div>

        {/* ID Type Overlay */}
        {showIDType && (
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
                <h3 className="text-lg font-semibold">Select ID Type</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {idTypes.map((type) => (
                  <button
                    key={type}
                    className={`w-full p-4 text-left transition 
                               hover:bg-green-50 ${
                                 selectedID === type ? "bg-green-100" : ""
                               }`}
                    onClick={() => {
                      setSelectedID(type);
                      setShowIDType(false);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button
                className="w-full p-4 text-red-500 font-medium 
                           hover:bg-red-50 transition duration-200"
                onClick={() => setShowIDType(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label
            className="block text-gray-600 text-sm mb-2"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your full name"
            className="w-full p-4 border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
          />
        </div>

        {/* Profession */}
        <div>
          <label
            className="block text-gray-600 text-sm mb-2"
            htmlFor="profession"
          >
            Profession
          </label>
          <input
            type="text"
            id="profession"
            placeholder="Enter your profession"
            className="w-full p-4 border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-gray-600 text-sm mb-2" htmlFor="dob">
            Date Of Birth
          </label>
          <input
            type="text"
            id="dob"
            placeholder="Select Date of Birth"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            className="w-full p-4 border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
          />
        </div>

        {/* ID Number */}
        <div>
          <label
            className="block text-gray-600 text-sm mb-2"
            htmlFor="idNumber"
          >
            ID Card Number
          </label>
          <input
            type="text"
            id="idNumber"
            placeholder="Enter your ID card number"
            className="w-full p-4 border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
          />
        </div>

        {/* Region Selection */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-2" htmlFor="region">
            Current Region
          </label>
          <button
            type="button"
            id="region"
            className="w-full p-4 text-left border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
            onClick={() => setShowRegion(true)}
          >
            {selectedRegion}
          </button>
        </div>

        {/* Region Overlay */}
        {showRegion && (
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
                <h3 className="text-lg font-semibold">Select Region</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {regions.map((region) => (
                  <button
                    key={region}
                    className={`w-full p-4 text-left transition 
                               hover:bg-green-50 ${
                                 selectedRegion === region ? "bg-green-100" : ""
                               }`}
                    onClick={() => {
                      setSelectedRegion(region);
                      setShowRegion(false);
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
              <button
                className="w-full p-4 text-red-500 font-medium 
                           hover:bg-red-50 transition duration-200"
                onClick={() => setShowRegion(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Expiry Date */}
        <div>
          <label className="block text-gray-600 text-sm mb-2" htmlFor="expiry">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiry"
            placeholder="Select Expiry Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            className="w-full p-4 border border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-200 ease-in-out"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-4 rounded-3xl 
                     font-semibold hover:bg-green-600 transition 
                     duration-300 ease-in-out shadow-lg mt-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
