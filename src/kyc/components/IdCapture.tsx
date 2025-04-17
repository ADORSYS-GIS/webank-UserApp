// src/kyc/components/IdCapture.tsx
import React from "react";

interface IdCaptureProps {
    title: string;
    description: string;
    sampleImageSrc: string;
    uploadAccept?: string;
    onClose: () => void;
    onFileCaptured: (file: File) => void;
}

const IdCapture: React.FC<IdCaptureProps> = ({
                                                 title,
                                                 description,
                                                 sampleImageSrc,
                                                 uploadAccept = "image/*",
                                                 onClose,
                                                 onFileCaptured,
                                             }) => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileCaptured(file);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-11/12 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
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
                <p className="text-gray-600 text-center mb-4">{description}</p>
                <div className="flex justify-center mb-4">
                    <img
                        className="w-full h-auto rounded-lg"
                        src={sampleImageSrc}
                        alt={`Example of a ${title}`}
                    />
                </div>
                <div className="w-full">
                    <label
                        htmlFor={`${title.replace(/\s/g, "").toLowerCase()}-upload`}
                        className="block w-full bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition duration-200 cursor-pointer text-center"
                    >
                        Upload from Device
                    </label>
                    <input
                        id={`${title.replace(/\s/g, "").toLowerCase()}-upload`}
                        type="file"
                        accept={uploadAccept}
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>
        </div>
    );
};

export default IdCapture;