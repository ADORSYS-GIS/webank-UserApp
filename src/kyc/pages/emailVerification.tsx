// InputEmail.tsx (fifth file)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleProceed = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      navigate("/emailCode");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-white overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="w-full max-w-md p-6 bg-gray-100 shadow-lg rounded-2xl text-center">
        <h1 className="text-3xl font-bold mb-3">Email Verification</h1>
        <p className="text-gray-600 mb-4">
          Please enter a valid email address to receive a 6-digit code.
        </p>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#20B2AA] focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="w-full py-3 bg-[#20B2AA] text-white font-semibold rounded-full shadow-md hover:bg-[#1C8C8A] transition"
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default InputEmail;
