import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDisableScroll from "../../hooks/useDisableScroll";

const InputEmail: React.FC = () => {
  useDisableScroll();
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
      className="relative h-screen w-screen bg-white"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Back Icon */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 focus:outline-none"
        aria-label="Go Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      {/* Email Verification Content */}
      <div className="w-full max-w-md p-6 mx-auto mt-5 rounded-2xl">
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
      </div>

      {/* Proceed Button at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="max-w-md mx-auto">
          <button
            className="w-full py-3 bg-[#20B2AA] text-white font-semibold rounded-full shadow-md hover:bg-[#1C8C8A] transition"
            onClick={handleProceed}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputEmail;
