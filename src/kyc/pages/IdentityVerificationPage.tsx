import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../store/Store.ts";
import VerificationModal from "../components/VerificationModal";
import { logEvent } from "../../utils/analytics";

// Import FontAwesome instead of react-icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faCloudUploadAlt,
  faCheck,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface VerificationStep {
  id: number;
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onClick: () => void;
}

export default function IdentityVerification() {
  const navigate = useNavigate();
  const [showVerificationModalPopup, setShowVerificationModalPopup] =
    useState(false);
  const [personalInfoSubmitted, setPersonalInfoSubmitted] = useState(false);
  const [documentsSubmitted, setDocumentsSubmitted] = useState(false);

  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const status = useSelector((state: RootState) => state.account.status);
  const documentStatus = useSelector(
    (state: RootState) => state.account.documentStatus,
  );
  const accountId = useSelector((state: RootState) => state.account.accountId);

  // Check if both statuses are "PENDING" to enable the submit button
  const bothStatusesPending =
    status === "PENDING" && documentStatus === "PENDING";

  useEffect(() => {
    if (status === "PENDING") {
      setPersonalInfoSubmitted(true);
      // Log KYC document upload
      logEvent("kyc_document_uploaded", {
        status: "PENDING",
        document_type: "personal_info",
      });
    }
    if (documentStatus === "PENDING") {
      setDocumentsSubmitted(true);
      // Log KYC verification
      logEvent("kyc_verified", {
        status: "PENDING",
        document_type: "identity_documents",
      });
    }

    // Log KYC status changes
    if (status === "APPROVED") {
      logEvent("kyc_status_changed", {
        status: "APPROVED",
        document_type: "personal_info",
      });
    } else if (status === "REJECTED") {
      logEvent("kyc_status_changed", {
        status: "REJECTED",
        document_type: "personal_info",
      });
    }

    if (documentStatus === "APPROVED") {
      logEvent("kyc_status_changed", {
        status: "APPROVED",
        document_type: "identity_documents",
      });
    } else if (documentStatus === "REJECTED") {
      logEvent("kyc_status_changed", {
        status: "REJECTED",
        document_type: "identity_documents",
      });
    }
  }, [documentStatus, status]);

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: "Personal Info",
      description: "Enter your address and ID details",
      icon: faUserEdit,
      onClick: () => setShowVerificationModalPopup(true),
    },
    {
      id: 2,
      title: "Upload Documents",
      description:
        "Follow instructions to upload your ID and verification documents",
      icon: faCloudUploadAlt,
      onClick: () => navigate("/guidelines"),
    },
  ];

  const handleSubmit = () => {
    if (!accountCert || !accountId) {
      toast.error("Account information is missing");
      return;
    }
    navigate("/verification/location");
  };

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-6 max-w-2xl mx-auto flex flex-col relative overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <button
        type="button"
        onClick={() => navigate("/settings")}
        className="absolute top-6 left-4 md:left-6 flex items-center space-x-2 group"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="w-6 h-6 text-gray-500 group-hover:text-blue-500 transition-colors"
        />
        <span className="text-gray-600 group-hover:text-blue-500 transition-colors text-sm font-medium">
          Back
        </span>
      </button>

      <div className="text-center space-y-4 mb-6 md:mb-8 pt-12">
        <div className="flex items-center justify-center">
          <img
            src="https://img.icons8.com/?size=100&id=qs973rWPpRhU&format=png&color=3B82F6"
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

      <div className="space-y-4 overflow-y-auto overflow-x-hidden pb-4 w-full">
        {steps.map((step) => {
          const isCompleted =
            step.id === 1 ? personalInfoSubmitted : documentsSubmitted;
          return (
            <button
              key={step.id}
              type="button"
              onClick={isCompleted ? undefined : step.onClick}
              disabled={isCompleted}
              className={`group p-4 md:p-6 rounded-xl border transition-all
                         flex items-center justify-between
                         w-full text-left ${
                           isCompleted
                             ? "bg-gray-50 cursor-not-allowed opacity-75"
                             : "cursor-pointer hover:scale-[1.005] hover:border-blue-500"
                         }`}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-500">
                  <FontAwesomeIcon icon={step.icon} className="text-xl" />
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
              {isCompleted ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="w-5 h-5 text-blue-500 flex-shrink-0"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="w-6 h-6 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-gray-100 bg-white w-full mt-15">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!bothStatusesPending}
          className={`w-full py-4 text-white font-semibold text-base md:text-lg rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg ${
            bothStatusesPending
              ? "bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/50"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Secure My Account</span>
        </button>
      </div>

      {showVerificationModalPopup && (
        <VerificationModal
          onClose={() => setShowVerificationModalPopup(false)}
        />
      )}
    </div>
  );
}
