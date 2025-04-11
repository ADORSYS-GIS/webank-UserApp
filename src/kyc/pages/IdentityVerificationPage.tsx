import { useState, useEffect } from "react";
import { FaUserEdit, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import VerificationModal from "../components/VerificationModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store.ts";
import { toast, ToastContainer } from "react-toastify";

interface VerificationStep {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  onClick: () => void;
}

export default function IdentityVerification() {
  const navigate = useNavigate();
  const [showVerificationModalPopup, setShowVerificationModalPopup] =
    useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [personalInfoSubmitted, setPersonalInfoSubmitted] = useState(false);

  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const status = useSelector((state: RootState) => state.account.status);

  useEffect(() => {
    if (status === "PENDING") {
      setPersonalInfoSubmitted(true);
    }
  }, [status]);

  const accountId = useSelector((state: RootState) => state.account.accountId);

  const redirectToWhatsApp = () => {
    const whatsappNumber = "674388690";
    const message = `Hello, I'd like to upload my KYC documents for account ID: ${accountId}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: "Personal Info",
      description: "Enter your address and ID details",
      icon: <FaUserEdit className="w-6 h-6 text-[#20B2AA]" />,
      onClick: () => setShowVerificationModalPopup(true),
    },
    {
      id: 2,
      title: "Upload Documents",
      description: "Upload your ID and verification documents via WhatsApp",
      icon: <FaCloudUploadAlt className="w-6 h-6 text-[#20B2AA]" />,
      onClick: redirectToWhatsApp,
    },
  ];

  const handleSubmit = () => {
    if (!accountCert || !accountId) {
      toast.error("Account information is missing");
      return;
    }
    setShowConfirmationModal(true);
  };

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-6 max-w-2xl mx-auto flex flex-col relative overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 md:left-6 flex items-center space-x-2 group"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-[#20B2AA] transition-colors" />
        <span className="text-gray-600 group-hover:text-[#20B2AA] transition-colors text-sm font-medium">
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
          Let's Verify Your Identity
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-prose mx-auto leading-relaxed">
          Follow these quick steps to complete your identity verification and
          secure your account.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden pb-4 w-full">
        {steps.map((step) => {
          const isPersonalInfoCompleted =
            step.id === 1 && personalInfoSubmitted;
          return (
            <button
              key={step.id}
              type="button"
              onClick={isPersonalInfoCompleted ? undefined : step.onClick}
              disabled={isPersonalInfoCompleted}
              className={`group p-4 md:p-6 rounded-xl border transition-all
                         flex items-center justify-between
                         w-full text-left ${
                           isPersonalInfoCompleted
                             ? "bg-gray-50 cursor-not-allowed opacity-75"
                             : "cursor-pointer hover:scale-[1.005] hover:border-[#20B2AA]"
                         }`}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div
                  className={`p-3 rounded-lg shadow-sm border flex-shrink-0 ${
                    isPersonalInfoCompleted
                      ? "border-green-100 bg-green-50"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold tracking-tight text-gray-900 truncate">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-snug line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
              {isPersonalInfoCompleted ? (
                <FaCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <FiChevronRight className="w-6 h-6 flex-shrink-0 text-gray-400 group-hover:text-[#20B2AA] transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-100 bg-white w-full">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-4 bg-[#20B2AA] hover:bg-[#1C8C8A] text-white font-semibold text-base md:text-lg rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-[#20B2AA]/50"
        >
          <span>Secure My Account</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showVerificationModalPopup && (
        <VerificationModal
          onClose={() => setShowVerificationModalPopup(false)}
        />
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <p className="text-gray-800 mb-6 text-center text-sm md:text-base">
              Are you sure you submitted all the required documents via
              WhatsApp?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  navigate("/verification/location");
                }}
                className="px-6 py-2 bg-[#20B2AA] hover:bg-[#1C8C8A] text-white font-medium rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
