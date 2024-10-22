import React, { useState } from "react";
import "./register.css";
import WebankLogo from "../assets/Webank.png";
import parsePhoneNumberFromString from "libphonenumber-js";

type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

const countryOptions: CountryOption[] = [
  { value: "+237", label: "Cameroon", flag: "https://flagcdn.com/w40/cm.png" },
  {
    value: "+1",
    label: "United States",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    value: "+44",
    label: "United Kingdom",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  { value: "+33", label: "France", flag: "https://flagcdn.com/w40/fr.png" },
  { value: "+49", label: "Germany", flag: "https://flagcdn.com/w40/de.png" },
  { value: "+91", label: "India", flag: "https://flagcdn.com/w40/in.png" },
  { value: "+234", label: "Nigeria", flag: "https://flagcdn.com/w40/ng.png" },
  { value: "+86", label: "China", flag: "https://flagcdn.com/w40/cn.png" },
  { value: "+81", label: "Japan", flag: "https://flagcdn.com/w40/jp.png" },
  { value: "+61", label: "Australia", flag: "https://flagcdn.com/w40/au.png" },
  { value: "+55", label: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
  { value: "+7", label: "Russia", flag: "https://flagcdn.com/w40/ru.png" },
  { value: "+62", label: "Indonesia", flag: "https://flagcdn.com/w40/id.png" },
  {
    value: "+27",
    label: "South Africa",
    flag: "https://flagcdn.com/w40/za.png",
  },
  { value: "+52", label: "Mexico", flag: "https://flagcdn.com/w40/mx.png" },
  {
    value: "+82",
    label: "South Korea",
    flag: "https://flagcdn.com/w40/kr.png",
  },
  { value: "+34", label: "Spain", flag: "https://flagcdn.com/w40/es.png" },
  { value: "+39", label: "Italy", flag: "https://flagcdn.com/w40/it.png" },
  { value: "+47", label: "Norway", flag: "https://flagcdn.com/w40/no.png" },
  { value: "+351", label: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
  {
    value: "+41",
    label: "Switzerland",
    flag: "https://flagcdn.com/w40/ch.png",
  },
  {
    value: "+31",
    label: "Netherlands",
    flag: "https://flagcdn.com/w40/nl.png",
  },
  { value: "+46", label: "Sweden", flag: "https://flagcdn.com/w40/se.png" },
  { value: "+32", label: "Belgium", flag: "https://flagcdn.com/w40/be.png" },
  { value: "+48", label: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
  {
    value: "+420",
    label: "Czech Republic",
    flag: "https://flagcdn.com/w40/cz.png",
  },
  { value: "+353", label: "Ireland", flag: "https://flagcdn.com/w40/ie.png" },
  { value: "+356", label: "Malta", flag: "https://flagcdn.com/w40/mt.png" },
  { value: "+358", label: "Finland", flag: "https://flagcdn.com/w40/fi.png" },
  { value: "+372", label: "Estonia", flag: "https://flagcdn.com/w40/ee.png" },
  { value: "+30", label: "Greece", flag: "https://flagcdn.com/w40/gr.png" },
  { value: "+357", label: "Cyprus", flag: "https://flagcdn.com/w40/cy.png" },
  { value: "+386", label: "Slovenia", flag: "https://flagcdn.com/w40/si.png" },
  { value: "+381", label: "Serbia", flag: "https://flagcdn.com/w40/rs.png" },
  { value: "+216", label: "Tunisia", flag: "https://flagcdn.com/w40/tn.png" },
  { value: "+90", label: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },
  { value: "+964", label: "Iraq", flag: "https://flagcdn.com/w40/iq.png" },
  { value: "+962", label: "Jordan", flag: "https://flagcdn.com/w40/jo.png" },
  { value: "+961", label: "Lebanon", flag: "https://flagcdn.com/w40/lb.png" },
  { value: "+973", label: "Bahrain", flag: "https://flagcdn.com/w40/bh.png" },
  { value: "+974", label: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
  {
    value: "+966",
    label: "Saudi Arabia",
    flag: "https://flagcdn.com/w40/sa.png",
  },
  {
    value: "+971",
    label: "United Arab Emirates",
    flag: "https://flagcdn.com/w40/ae.png",
  },
  { value: "+92", label: "Pakistan", flag: "https://flagcdn.com/w40/pk.png" },
  { value: "+977", label: "Nepal", flag: "https://flagcdn.com/w40/np.png" },
  {
    value: "+880",
    label: "Bangladesh",
    flag: "https://flagcdn.com/w40/bd.png",
  },
  { value: "+94", label: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png" },
  { value: "+95", label: "Myanmar", flag: "https://flagcdn.com/w40/mm.png" },
  { value: "+66", label: "Thailand", flag: "https://flagcdn.com/w40/th.png" },
  {
    value: "+63",
    label: "Philippines",
    flag: "https://flagcdn.com/w40/ph.png",
  },
  { value: "+60", label: "Malaysia", flag: "https://flagcdn.com/w40/my.png" },
  { value: "+65", label: "Singapore", flag: "https://flagcdn.com/w40/sg.png" },
  {
    value: "+64",
    label: "New Zealand",
    flag: "https://flagcdn.com/w40/nz.png",
  },
  { value: "+505", label: "Nicaragua", flag: "https://flagcdn.com/w40/ni.png" },
  { value: "+591", label: "Bolivia", flag: "https://flagcdn.com/w40/bo.png" },
  { value: "+56", label: "Chile", flag: "https://flagcdn.com/w40/cl.png" },
  { value: "+51", label: "Peru", flag: "https://flagcdn.com/w40/pe.png" },
  { value: "+54", label: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
  { value: "+598", label: "Uruguay", flag: "https://flagcdn.com/w40/uy.png" },
  {
    value: "+222",
    label: "Mauritania",
    flag: "https://flagcdn.com/w40/mr.png",
  },
  { value: "+968", label: "Oman", flag: "https://flagcdn.com/w40/om.png" },
  { value: "+963", label: "Syria", flag: "https://flagcdn.com/w40/sy.png" },
  { value: "+972", label: "Israel", flag: "https://flagcdn.com/w40/il.png" },
  {
    value: "+994",
    label: "Azerbaijan",
    flag: "https://flagcdn.com/w40/az.png",
  },
  { value: "+967", label: "Yemen", flag: "https://flagcdn.com/w40/ye.png" },
  { value: "+220", label: "Gambia", flag: "https://flagcdn.com/w40/gm.png" },
  { value: "+267", label: "Botswana", flag: "https://flagcdn.com/w40/bw.png" },
  { value: "+256", label: "Uganda", flag: "https://flagcdn.com/w40/ug.png" },
  { value: "+251", label: "Ethiopia", flag: "https://flagcdn.com/w40/et.png" },
  { value: "+254", label: "Kenya", flag: "https://flagcdn.com/w40/ke.png" },
  { value: "+250", label: "Rwanda", flag: "https://flagcdn.com/w40/rw.png" },
  { value: "+249", label: "Sudan", flag: "https://flagcdn.com/w40/sd.png" },
  { value: "+221", label: "Senegal", flag: "https://flagcdn.com/w40/sn.png" },
  { value: "+212", label: "Morocco", flag: "https://flagcdn.com/w40/ma.png" },
  { value: "+213", label: "Algeria", flag: "https://flagcdn.com/w40/dz.png" },
  {
    value: "+258",
    label: "Mozambique",
    flag: "https://flagcdn.com/w40/mz.png",
  },
  {
    value: "+236",
    label: "Central African Republic",
    flag: "https://flagcdn.com/w40/cf.png",
  },
  {
    value: "+243",
    label: "Democratic Republic of the Congo",
    flag: "https://flagcdn.com/w40/cd.png",
  },
  { value: "+260", label: "Zambia", flag: "https://flagcdn.com/w40/zm.png" },
  {
    value: "+261",
    label: "Madagascar",
    flag: "https://flagcdn.com/w40/mg.png",
  },
  { value: "+263", label: "Zimbabwe", flag: "https://flagcdn.com/w40/zw.png" },
];

const Register: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions[0],
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to control dropdown visibility
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to handle search input

  // Filter the country options based on the search term
  const filteredCountries = countryOptions.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCountryChange = (option: CountryOption) => {
    setSelectedCountry(option);
    setIsOpen(false); // Close the dropdown when a country is selected
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    // Allow only digits (empty string is valid for clearing the input)
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a phone number."); // Notify user if phone number is empty
      return;
    }

    const fullPhoneNumber = selectedCountry?.value + phoneNumber;

    const phoneNumberObj = parsePhoneNumberFromString(fullPhoneNumber);
    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      alert("Please enter a valid phone number.");
      return;
    }
    setIsLoading(true); // Set loading state
    try {
      // Replace with your actual OTP sending logic
      console.log("Sending OTP to:", phoneNumber);
      // Simulate a network request with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("OTP sent!"); // Notify user upon success
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again."); // Notify user upon error
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 lg:px-20 lg:py-10">
      <div className="mt-10">
        <img
          src={WebankLogo}
          alt="WeBank Logo"
          className="w-auto h-60 lg:w-60 -mt-10"
        />
      </div>

      <div className="text-center mt-6">
        <h1 className="text-xl font-bold lg:text-2xl">
          Register for a bank account
        </h1>
        <p className="text-gray-500 lg:text-lg">
          Please enter your phone number
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm lg:max-w-md">
        <label htmlFor="phone" className="block text-left font-medium">
          Phone Number
        </label>
        <div className="flex mt-2 items-center">
          <div className="relative w-1/3">
            <div
              className="flex items-center justify-between cursor-pointer border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleDropdown}
              style={{ height: "48px" }} // Ensure height matches input
            >
              <div className="flex items-center">
                <img
                  src={selectedCountry?.flag}
                  alt=""
                  className="w-6 h-4 mr-2"
                />
                <span>{selectedCountry?.value}</span>
              </div>
              <span className="material-icons">arrow_drop_down</span>
            </div>

            {isOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-64 overflow-auto">
                <input
                  type="text"
                  placeholder="Search Country"
                  className="w-full p-2 border-b focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                />
                {filteredCountries.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCountryChange(option)}
                  >
                    <img src={option.flag} alt="" className="w-6 h-4 mr-2" />
                    <span>
                      {option.label} ({option.value})
                    </span>
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="p-2 text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          <input
            type="tel"
            pattern="[0-9]*" // Regex pattern to allow only numbers
            placeholder="Phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:text-lg"
            required
          />
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm lg:max-w-md">
        <button
          type="button"
          onClick={handleSendOTP}
          className="w-full py-3 bg-gradient-to-r from-[#4960F9] to-[#1433FF] text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4960F9] lg:text-lg hover:bg-[#1433FF] transition duration-300 rounded-3xl"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Sending..." : "Send OTP"} {/* Show loading text */}
        </button>
      </div>
    </div>
  );
};

export default Register;
