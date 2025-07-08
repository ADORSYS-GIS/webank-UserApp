// DocumentImages.tsx
import { useEffect, useState } from "react";
import FrontId from "./FrontId";
import BackId from "./BackId";
import SelfieId from "./SelfieId";
import TaxpayerId from "./TaxpayerId";
import { useAccountStore } from "@state/accountStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useKycManagementServicePostApiPrsKycDocuments } from "@openapi/generated/prs/queries/queries";
import { ArrowLeft, Upload } from "react-feather";

type DocumentType = "frontID" | "backID" | "selfieID" | "taxDoc";
type ActivePopup = DocumentType | null;

const DocumentImages = () => {
  const [images, setImages] = useState<Record<DocumentType, string | null>>({
    frontID: null,
    backID: null,
    selfieID: null,
    taxDoc: null,
  });
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);

  const { setDocumentStatus } = useAccountStore();
  const navigate = useNavigate();

  const submitDocumentsMutation =
    useKycManagementServicePostApiPrsKycDocuments();

  // Helper utilities to simplify handleSubmitDocuments and lower cognitive complexity
  const isSuccessfulStatus = (status?: string) =>
    ["PENDING", "IN_REVIEW", "APPROVED"].includes(status ?? "");

  const showErrorToast = (message: string) => toast.error(message);

  const handleSubmitDocuments = async () => {
    const { accountId, accountCert } = useAccountStore.getState();
    if (!accountCert || !accountId) {
      showErrorToast("Account information is missing.");
      navigate("/guidelines");
      return;
    }

    try {
      const requestBody = {
        frontId: images.frontID ?? "",
        backId: images.backID ?? "",
        selfieId: images.selfieID ?? "",
        taxId: images.taxDoc ?? undefined,
        accountId,
      };

      const response = await submitDocumentsMutation.mutateAsync({
        requestBody,
      });

      if (isSuccessfulStatus(response?.status)) {
        setDocumentStatus("PENDING");
        toast.success("Documents submitted successfully");
        navigate("/kyc");
        return;
      }

      showErrorToast(response?.message ?? "Failed to submit documents");
    } catch (error: unknown) {
      console.error("Error submitting documents:", error);
      const errorMsg =
        typeof error === "object" && error !== null && "message" in error
          ? ((error as { message?: string }).message ??
            "Error submitting documents")
          : "Error submitting documents";
      showErrorToast(errorMsg);
    }
  };

  useEffect(() => {
    const loadImagesFromDB = async () => {
      try {
        const mockDB: Record<DocumentType, string> = {
          frontID: localStorage.getItem("frontID") ?? "",
          backID: localStorage.getItem("backID") ?? "",
          selfieID: localStorage.getItem("selfieID") ?? "",
          taxDoc: localStorage.getItem("taxDoc") ?? "",
        };

        setImages({
          frontID: mockDB.frontID || null,
          backID: mockDB.backID || null,
          selfieID: mockDB.selfieID || null,
          taxDoc: mockDB.taxDoc || null,
        });
      } catch (error) {
        console.error("Error loading images from DB:", error);
      }
    };

    loadImagesFromDB();
  }, []);

  const getDocumentLabel = (type: DocumentType): string => {
    switch (type) {
      case "frontID":
        return "Front of ID Card";
      case "backID":
        return "Back of ID Card";
      case "selfieID":
        return "Selfie with ID Card";
      case "taxDoc":
        return "Tax Payer Document";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Back
        </button>
        <a
          href="/guidelines"
          className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium flex items-center"
        >
          View detailed instructions
          <ArrowLeft className="ml-2 rotate-180" />
        </a>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-8">
        {(Object.keys(images) as DocumentType[]).map((type) => (
          <div key={type} className="space-y-2">
            <h3 className="text-gray-800 font-medium text-sm">
              {getDocumentLabel(type)}
            </h3>
            <button
              onClick={() => !images[type] && setActivePopup(type)}
              className={`relative group w-full h-64 bg-white rounded-xl border-2 ${
                !images[type]
                  ? "border-dashed cursor-pointer hover:border-blue-500"
                  : "border-solid border-blue-100"
              } transition-all duration-200 p-4 flex flex-col items-center justify-center`}
            >
              {images[type] ? (
                <img
                  src={images[type]}
                  alt={getDocumentLabel(type)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-500 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Upload Document
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPEG, PNG
                    </p>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Popups */}
      {activePopup === "frontID" && (
        <FrontId onClose={() => setActivePopup(null)} />
      )}
      {activePopup === "backID" && (
        <BackId onClose={() => setActivePopup(null)} />
      )}
      {activePopup === "selfieID" && (
        <SelfieId onClose={() => setActivePopup(null)} />
      )}
      {activePopup === "taxDoc" && (
        <TaxpayerId onClose={() => setActivePopup(null)} />
      )}

      {/* Submit Button */}
      <button
        onClick={() => {
          if (
            !images.frontID ||
            !images.backID ||
            !images.selfieID ||
            !images.taxDoc
          ) {
            toast.warning(
              "Please upload all required documents before submitting.",
            );
            return;
          }
          handleSubmitDocuments();
        }}
        className="self-center"
      >
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Submit Documents
        </button>
      </button>
    </div>
  );
};

export default DocumentImages;
