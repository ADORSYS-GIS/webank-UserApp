import { useState } from "react";
import {
  FaUserEdit,
  FaIdCard,
  FaCameraRetro,
  FaFileInvoice,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FrontId from "./FrontId";
import SelfieId from "./SelfieId";
import BackId from "./BackId";

interface VerificationStep {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  onClick: () => void;
}

export default function IdentityVerification() {
  const navigate = useNavigate(); // 1) Access the navigate function
  const [showFrontIdPopup, setShowFrontIdPopup] = useState(false);
  const [showBackIdPopup, setShowBackIdPopup] = useState(false);
  const [showSelfieIdPopup, setShowSelfieIdPopup] = useState(false);

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: "Personal Info",
      description: "Enter your address and ID details and upload",
      icon: <FaUserEdit className="w-6 h-6 text-emerald-700" />,
      onClick: () => navigate("/kyc/personal-info") 
    },
    {
      id: 2,
      title: "Upload your Front ID",
      description: "Take a clear photo of the front of your government-issued ID",
      icon: <FaIdCard className="w-6 h-6 text-emerald-700" />,
      onClick: () => setShowFrontIdPopup(true) 
    },
    {
      id: 3,
      title: "Upload your Back ID",
      description: "Take a clear photo of the back of your government-issued ID",
      icon: (
        <FaIdCard className="w-6 h-6 text-emerald-700 transform rotate-180" />
      ),
      onClick: () => setShowBackIdPopup(true) 
    },
    {
      id: 4,
      title: "Take a photo with your ID",
      description:
        "Take a clear photo of you holding your government-issued ID",
      icon: <FaCameraRetro className="w-6 h-6 text-emerald-700" />,
      onClick: () => setShowSelfieIdPopup(true)
    },
    {
      id: 5,
      title: "Tax Identifier Document",
      description: "Upload your government-issued tax identification document.",
      icon: <FaFileInvoice className="w-6 h-6 text-emerald-700" />,
      onClick: () => {
        navigate("/tax-document");
      },
    },
  ];

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-6 max-w-2xl mx-auto flex flex-col relative"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* "Back" Button */}
      <button
        onClick={() => navigate(-1)} // or any other route you like
        className="absolute top-6 left-4 md:left-6 flex items-center space-x-2 group"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-emerald-700 transition-colors" />
        <span className="text-gray-600 group-hover:text-emerald-700 transition-colors text-sm font-medium">
          Back
        </span>
      </button>

      {/* Header */}
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

      {/* Steps List */}
      <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden pb-4">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={step.onClick}
            className="group p-4 md:p-6 rounded-xl border transition-all cursor-pointer 
                       flex items-center justify-between 
                       transform hover:scale-[1.005] hover:border-emerald-500 
                       overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold tracking-tight text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
            <FiChevronRight className="w-6 h-6 min-w-6 text-gray-400 group-hover:text-emerald-700 transition-colors" />
          </div>
        ))}
      </div>

      {/* Submission Button */}
      <div className="pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={() => console.log("Submission triggered")}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base md:text-lg rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-100/50"
        >
          <span>Secure My Account</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
      {showFrontIdPopup && <FrontId onClose={() => setShowFrontIdPopup(false)} />}
      {showBackIdPopup && <BackId onClose={() => setShowBackIdPopup(false)} />}
      {showSelfieIdPopup && (
        <SelfieId onClose={() => setShowSelfieIdPopup(false)} />
      )}

    </div>
  );
}
