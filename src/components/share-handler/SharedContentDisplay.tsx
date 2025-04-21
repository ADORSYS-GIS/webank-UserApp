import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faFilePdf,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export interface SharedContent {
  title: string;
  text: string;
  url: string;
  files: Array<{
    name: string;
    type: string;
    size: number;
    blob?: Blob;
    base64?: string;
  }>;
}

interface SharedContentDisplayProps {
  sharedData: SharedContent;
  handleDestinationSelect: (docType: string) => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return faImage;
  if (mimeType === "application/pdf") return faFilePdf;
  return faFileLines;
}

function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export default function SharedContentDisplay({
  sharedData,
  handleDestinationSelect,
}: SharedContentDisplayProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-[#20B2AA] hover:text-[#1C8C8A] flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Home
      </button>

      <h1 className="text-2xl font-bold mb-6">Received Shared Content</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Files to Upload</h2>
        <div className="grid gap-4">
          {sharedData.files.map((file, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center mb-2">
                <FontAwesomeIcon
                  icon={getFileIcon(file.type)}
                  className="text-[#20B2AA] mr-3 text-xl"
                />
                <span className="font-medium break-all">{file.name}</span>
              </div>
              <p className="text-sm text-gray-500">
                {file.type} • {formatFileSize(file.size)}
              </p>
              {file.type.startsWith("image/") && file.blob && (
                <img
                  src={URL.createObjectURL(file.blob)}
                  alt="Preview"
                  className="mt-2 max-h-48 w-auto object-contain border rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Select KYC Document Type</h2>
        <div className="grid gap-3">
          <button
            onClick={() => handleDestinationSelect("front-id")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">🆔 Submit Front ID</span>
            <span className="text-sm text-gray-500">
              Upload the front side of your identity document
            </span>
          </button>

          <button
            onClick={() => handleDestinationSelect("back-id")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">🆔 Submit Back ID</span>
            <span className="text-sm text-gray-500">
              Upload the back side of your identity document
            </span>
          </button>

          <button
            onClick={() => handleDestinationSelect("selfie")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">🤳 Submit Selfie</span>
            <span className="text-sm text-gray-500">
              Upload a selfie for identity verification
            </span>
          </button>

          <button
            onClick={() => handleDestinationSelect("tax-id")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">
              📄 Submit Tax Identification Document
            </span>
            <span className="text-sm text-gray-500">
              Upload your tax identification document
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
