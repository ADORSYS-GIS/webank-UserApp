// src/kyc/components/IdCapture.tsx
import React from "react";

interface IdCaptureProps {
  title: string;
  description: string;
  sampleImageSrc: string;
  onClose: () => void;
  sampleImageStyle?: React.CSSProperties;
}

const IdCapture: React.FC<IdCaptureProps> = ({
  title,
  description,
  sampleImageSrc,
  onClose,
  sampleImageStyle = {},
}) => {
  const closePopup = () => {
    onClose();
  };

  const handleWhatsappUpload = () => {
    const whatsappNumber = localStorage.getItem("phoneNumber");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;
    window.open(whatsappUrl, "_blank");
    console.log("Upload from WhatsApp clicked");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-11/12 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div> {/* Empty space for balance */}
          <button
            onClick={closePopup}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-lg font-semibold text-center mb-2">
          Let's Verify Your Identity
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Follow these steps to complete your identity verification securely.
        </p>
        <div className="flex justify-center mb-4">
          <img
            className="w-full h-auto rounded-lg"
            src={sampleImageSrc}
            alt={`Example of a ${title}`}
            style={sampleImageStyle}
          />
        </div>
        <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-4">{description}</p>
        <button
          onClick={handleWhatsappUpload}
          className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.149-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.215-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.793.372-.273.298-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347m-5.421 7.318h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 0 1-1.519-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.003 5.452-4.437 9.887-9.882 9.887m8.413-18.3A11.815 11.815 0 0 0 12.05.001C5.495 0 .003 5.49 0 12.046c0 2.123.553 4.198 1.604 6.032L.057 24l6.085-1.598a11.95 11.95 0 0 0 5.94 1.516h.005c6.552 0 11.945-5.49 11.948-12.043a11.89 11.89 0 0 0-3.504-8.447" />
          </svg>
          Upload from WhatsApp
        </button>
      </div>
    </div>
  );
};

export default IdCapture;
