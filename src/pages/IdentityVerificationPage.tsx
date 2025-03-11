import { useState } from "react";
import {
  FaUserEdit,
  FaIdCard,
  FaCameraRetro,
  FaFileInvoice,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface VerificationStep {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

export default function IdentityVerification() {
  const [currentStep, setCurrentStep] = useState<number>(-1);

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: "Personal Info",
      description: "Enter your address and ID details and upload",
      icon: <FaUserEdit className="w-6 h-6 text-emerald-700" />,
    },
    {
      id: 2,
      title: "Upload your Front ID",
      description:
        "Take a clear photo of the front of your government-issued ID to verify your identity.",
      icon: <FaIdCard className="w-6 h-6 text-emerald-700" />,
    },
    {
      id: 3,
      title: "Upload your Back ID",
      description:
        "Take a clear photo of the back of your government-issued ID to verify your identity.",
      icon: (
        <FaIdCard className="w-6 h-6 text-emerald-700 transform rotate-180" />
      ),
    },
    {
      id: 4,
      title: "Take a photo with your ID",
      description:
        "Take a clear photo of you holding your government-issued ID to verify your identity.",
      icon: <FaCameraRetro className="w-6 h-6 text-emerald-700" />,
    },
    {
      id: 5,
      title: "Tax Identifier Document",
      description: "Upload your government-issued tax identification document.",
      icon: <FaFileInvoice className="w-6 h-6 text-emerald-700" />,
    },
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Front ID</h2>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Back ID</h2>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Photo with ID
            </h2>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Tax Identifier Document
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                Upload your tax identification document
              </p>
              <input
                type="file"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-6 max-w-2xl mx-auto flex flex-col relative"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <button
        onClick={() => setCurrentStep(-1)}
        className="absolute top-6 left-4 md:left-6 flex items-center space-x-2 group"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-emerald-700 transition-colors" />
        <span className="text-gray-600 group-hover:text-emerald-700 transition-colors text-sm font-medium">
          Back
        </span>
      </button>

      <div className="text-center space-y-4 mb-6 md:mb-8 pt-12">
        <div className="flex items-center justify-center">
          <img
            src="https://img.icons8.com/?size=100&id=qs973rWPpRhU&format=png&color=20B2AA"
            alt="Verification Icon"
            className="w-15 h-15 md:w-10 md:h-10 object-contain"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Let’s Verify Your Identity
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-prose mx-auto leading-relaxed">
          Follow these quick steps to complete your identity verification and
          secure your account.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {currentStep === -1 ? (
          steps.map((step, index) => (
            <div
              key={step.id}
              className={`group p-4 md:p-6 rounded-xl border transition-all cursor-pointer
                ${
                  currentStep === index
                    ? "border-emerald-700 bg-gradient-to-r from-emerald-50/50 to-white shadow-sm"
                    : "border-gray-200 hover:border-emerald-500"
                }
                flex items-center justify-between transform hover:scale-[1.005] transition-transform`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <h3
                    className={`text-base md:text-lg font-semibold tracking-tight ${
                      currentStep === index
                        ? "text-emerald-800"
                        : "text-gray-900"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
              <FiChevronRight
                className={`w-6 h-6 min-w-6 ${currentStep === index ? "text-emerald-700" : "text-gray-400"} group-hover:text-emerald-700 transition-colors`}
              />
            </div>
          ))
        ) : (
          <div className="p-4 md:p-6">{renderStepContent(currentStep)}</div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 bg-white">
        <button
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base md:text-lg rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-100/50"
          onClick={() => console.log("Submission triggered")}
        >
          <span>Secure My Account</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
