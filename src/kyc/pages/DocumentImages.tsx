// DocumentImages.tsx
import { useEffect, useState } from "react";
import FrontId from "./FrontId";
import BackId from "./BackId";
import SelfieId from "./SelfieId";
import TaxpayerId from "./TaxpayerId";
import {
  getDocumentImage,
  storeDocumentImage,
} from "../../components/share-handler/IndexedDBUtils";

type DocumentType = "frontID" | "backID" | "selfieID" | "taxDoc";
type ActivePopup = DocumentType | null;

// interface DocumentImage {
//   type: DocumentType;
//   url: string;
// }

const DocumentImages = () => {
  const [images, setImages] = useState<Record<DocumentType, string | null>>({
    frontID: null,
    backID: null,
    selfieID: null,
    taxDoc: null,
  });
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);

  useEffect(() => {
    const loadImagesFromDB = async () => {
      try {
        const documentTypes: DocumentType[] = [
          "frontID",
          "backID",
          "selfieID",
          "taxDoc",
        ];
        const loadedImages: Record<DocumentType, string | null> = {
          frontID: null,
          backID: null,
          selfieID: null,
          taxDoc: null,
        };
        for (const type of documentTypes) {
          loadedImages[type] = await getDocumentImage(type);
        }
        setImages(loadedImages);
      } catch (error) {
        console.error("Error loading images from DB:", error);
      }
    };

    loadImagesFromDB();
  }, []);

  const handleFileCaptured =
    (type: DocumentType) => async (file: File | Blob) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          await storeDocumentImage(type, base64Data);
          setImages((prev) => ({ ...prev, [type]: base64Data }));
        };
      } catch (error) {
        console.error("Error handling captured file:", error);
      }
    };

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
          className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          View detailed instructions →
        </a>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-8">
        {(Object.keys(images) as DocumentType[]).map((type) => (
          <div
            key={type}
            onClick={() => !images[type] && setActivePopup(type)}
            className={`relative group bg-white rounded-xl border-2 ${
              !images[type]
                ? "border-dashed cursor-pointer hover:border-green-600"
                : "border-solid"
            } border-gray-300 transition-colors p-6 flex flex-col items-center justify-center min-h-[300px]`}
          >
            {images[type] ? (
              <img
                src={images[type]!}
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
          </div>
        ))}
      </div>

      {/* Popups */}
      {activePopup === "frontID" && (
        <FrontId
          onClose={() => setActivePopup(null)}
          onFileCaptured={handleFileCaptured("frontID")}
        />
      )}
      {activePopup === "backID" && (
        <BackId
          onClose={() => setActivePopup(null)}
          onFileCaptured={handleFileCaptured("backID")}
        />
      )}
      {activePopup === "selfieID" && (
        <SelfieId
          onClose={() => setActivePopup(null)}
          onFileCaptured={handleFileCaptured("selfieID")}
        />
      )}
      {activePopup === "taxDoc" && (
        <TaxpayerId
          onClose={() => setActivePopup(null)}
          onFileCaptured={handleFileCaptured("taxDoc")}
        />
      )}

      {/* Submit Button */}
      <button className="self-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105">
        Submit Documents
      </button>
    </div>
  );
};

export default DocumentImages;
