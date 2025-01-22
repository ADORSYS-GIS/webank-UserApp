import React, { useState } from "react";
import { RequestToSendNonce } from "../services/keyManagement/requestService";

const DeviceRegistration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleRegisterDevice = async () => {
    setIsLoading(true);
    setResponseMessage(null);
    setIsContentVisible(false);

    try {
      const response = await RequestToSendNonce();
      console.log(response);

      setTimeout(async () => {
        setResponseMessage("Device registered successfully!");
        setIsLoading(false);
        setIsContentVisible(true);
      }, 5000);
    } catch (error) {
      if (error instanceof Error) {
        setResponseMessage(
          error.message || "Failed to register device. Try again.",
        );
      } else {
        setResponseMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
      setIsContentVisible(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-900 bg-opacity-50">
          <svg
            className="animate-spin h-16 w-16 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
          {isContentVisible && (
            <>
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Register Your Device
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Click the button below to register your device.
              </p>
              <button
                onClick={handleRegisterDevice}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition`}
              >
                {isLoading ? "Registering..." : "Register Device"}
              </button>
            </>
          )}
          {responseMessage && (
            <p
              className={`mt-4 text-center font-medium ${
                responseMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {responseMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceRegistration;
