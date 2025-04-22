// DocumentImages.tsx
import { useEffect, useState } from "react";
import FrontId from "./FrontId";
import BackId from "./BackId";
import SelfieId from "./SelfieId";
import TaxpayerId from "./TaxpayerId";
import { RequestToStoreKycDocument } from "../../services/keyManagement/requestService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setDocumentStatus } from "../../slices/accountSlice";

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

  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmitDocuments = async () => {
    try {
      const response = await RequestToStoreKycDocument(
        images.frontID ?? "",
        images.backID ?? "",
        images.selfieID ?? "",
        images.taxDoc ?? "",
        accountCert,
        accountId!,
      );

      console.log(response);
      if (response.includes("saved")) {
        dispatch(setDocumentStatus("PENDING"));
        toast.success("Documents submitted successfully");

        navigate("/kyc");
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
    }
  };
  useEffect(() => {
    const loadImagesFromDB = async () => {
      try {
        // Replace with actual IndexedDB implementation
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
      {/* Instructions Link */}
      <div className="text-right mb-8">
        <a
          href="/instructions"
          className="text-gray-700 hover:text-blueconst handleSubmitDocuments = () => {
    try {
        response = RequestToStoreKycDocument(
            
        )

    } catch(error) {
        console.error('Error submitting documents:', error);
    }
}-600 transition-colors text-sm font-medium"
        >
          View detailed instructions →
        </a>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-8">
        {(Object.keys(images) as DocumentType[]).map((type) => (
          <button
            key={type}
            onClick={() => !images[type] && setActivePopup(type)}
            className={`relative group bg-white rounded-xl border-2 ${
              !images[type]
                ? "border-dashed cursor-pointer hover:border-green-600"
                : "border-solid"
            } border-gray-300 transition-colors p-6 flex flex-col items-center justify-center min-h-[300px] w-full text-left`}
          >
            {images[type] ? (
              <img
                src={images[type]}
                alt={getDocumentLabel(type)}
                className="max-w-full h-48 object-contain mb-4"
              />
            ) : (
              <div className="text-gray-500 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="block text-sm font-medium">
                  {getDocumentLabel(type)}
                </span>
                <span className="block text-xs mt-1">
                  Click to add document
                </span>
              </div>
            )}
          </button>
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
        onClick={handleSubmitDocuments}
        className="self-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
      >
        Submit Documents
      </button>
      <ToastContainer />
    </div>
  );
};

export default DocumentImages;
