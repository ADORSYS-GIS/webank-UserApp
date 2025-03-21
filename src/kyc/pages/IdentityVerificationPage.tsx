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
import TaxpayerId from "./TaxpayerId";
import VerificationModal from "../components/VerificationModal";
import { RequestToStoreKycDocument } from "../../services/keyManagement/requestService.ts";
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

type FileOrBlob = File | Blob | null;

export default function IdentityVerification() {
  const navigate = useNavigate();
  const [showFrontIdPopup, setShowFrontIdPopup] = useState(false);
  const [showBackIdPopup, setShowBackIdPopup] = useState(false);
  const [showSelfieIdPopup, setShowSelfieIdPopup] = useState(false);
  const [showTaxpayerIdPopup, setShowTaxpayerIdPopup] = useState(false);
  const [showVerificationModalPopup, setShowVerificationModalPopup] =
    useState(false);

  // State to store each document file
  const [frontIdFile, setFrontIdFile] = useState<FileOrBlob>(null);
  const [backIdFile, setBackIdFile] = useState<FileOrBlob>(null);
  const [selfieIdFile, setSelfieIdFile] = useState<FileOrBlob>(null);
  const [taxpayerIdFile, setTaxpayerIdFile] = useState<FileOrBlob>(null);

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: "Personal Info",
      description: "Enter your address and ID details and upload",
      icon: <FaUserEdit className="w-6 h-6 text-[#20B2AA]" />,
      onClick: () => setShowVerificationModalPopup(true),
    },
    {
      id: 2,
      title: "Upload your Front ID",
      description:
        "Take a clear photo of the front of your government-issued ID",
      icon: <FaIdCard className="w-6 h-6 text-[#20B2AA]" />,
      onClick: () => setShowFrontIdPopup(true),
    },
    {
      id: 3,
      title: "Upload your Back ID",
      description:
        "Take a clear photo of the back of your government-issued ID",
      icon: (
        <FaIdCard className="w-6 h-6 text-[#20B2AA] transform rotate-180" />
      ),
      onClick: () => setShowBackIdPopup(true),
    },
    {
      id: 4,
      title: "Take a photo with your ID",
      description:
        "Take a clear photo of you holding your government-issued ID",
      icon: <FaCameraRetro className="w-6 h-6 text-[#20B2AA]" />,
      onClick: () => setShowSelfieIdPopup(true),
    },
    {
      id: 5,
      title: "Tax Identifier Document",
      description: "Upload your government-issued tax identification document.",
      icon: <FaFileInvoice className="w-6 h-6 text-[#20B2AA]" />,
      onClick: () => setShowTaxpayerIdPopup(true),
    },
  ];

  // Utility function to convert a file to a base64 string
  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  // Handle submission to the backend
  const handleSubmit = async () => {
    // Check if all files are uploaded
    if (!frontIdFile || !backIdFile || !selfieIdFile || !taxpayerIdFile) {
      toast.warn("Please upload all required documents");
      return;
    }

    try {
      // Convert files to base64 strings
      const frontIdBase64 = await fileToBase64(frontIdFile);
      const backIdBase64 = await fileToBase64(backIdFile);
      const selfieIdBase64 = await fileToBase64(selfieIdFile);
      const taxpayerIdBase64 = await fileToBase64(taxpayerIdFile);

      // Call RequestToStoreKycDocument with base64 strings
      const response = await RequestToStoreKycDocument(
        frontIdBase64,
        backIdBase64,
        selfieIdBase64,
        taxpayerIdBase64,
        accountCert,
      );

      if (response == "KYC Document sent successfully ") {
        toast.success("KYC Document submitted successfully");
        navigate("/dashboard");
      } else {
        toast.error("Error submitting KYC, please try again later");
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Error submitting KYC, please try again later");
    }
  };

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-6 max-w-2xl mx-auto flex flex-col relative"
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
          Let’s Verify Your Identity
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-prose mx-auto leading-relaxed">
          Follow these quick steps to complete your identity verification and
          secure your account.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden pb-4">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={step.onClick}
            className="group p-4 md:p-6 rounded-xl border transition-all cursor-pointer
                       flex items-center justify-between
                       transform hover:scale-[1.005] hover:border-[#20B2AA]
                       overflow-hidden w-full text-left"
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
            <FiChevronRight className="w-6 h-6 min-w-6 text-gray-400 group-hover:text-[#20B2AA] transition-colors" />
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 bg-white">
        <button
          type="button"
          onClick={handleSubmit} // Trigger the submission
          className="w-full py-4 bg-[#20B2AA] hover:bg-[#1C8C8A] text-white font-semibold text-base md:text-lg rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-[#20B2AA]/50"
        >
          <span>Secure My Account</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showFrontIdPopup && (
        <FrontId
          onClose={() => setShowFrontIdPopup(false)}
          onFileCaptured={(file) => setFrontIdFile(file)} // Save the file
        />
      )}
      {showBackIdPopup && (
        <BackId
          onClose={() => setShowBackIdPopup(false)}
          onFileCaptured={(file) => setBackIdFile(file)}
        />
      )}
      {showSelfieIdPopup && (
        <SelfieId
          onClose={() => setShowSelfieIdPopup(false)}
          onFileCaptured={(file) => setSelfieIdFile(file)}
        />
      )}
      {showTaxpayerIdPopup && (
        <TaxpayerId
          onClose={() => setShowTaxpayerIdPopup(false)}
          onFileCaptured={(file) => setTaxpayerIdFile(file)}
        />
      )}
      {showVerificationModalPopup && (
        <VerificationModal
          onClose={() => setShowVerificationModalPopup(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
}
