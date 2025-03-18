import React, { useState } from "react";
import { useCapture } from "../hooks/useCapture";
import {RequestToStoreKycDocument} from "../../services/keyManagement/requestService.ts";
interface IdCaptureProps {
    title: string;
    description: string;
    sampleImageSrc: string;
    uploadAccept?: string;
    onClose: () => void;
}

const IdCapture: React.FC<IdCaptureProps> = ({
                                                 title,
                                                 description,
                                                 sampleImageSrc,
                                                 uploadAccept = "image/*",
                                                 onClose,
                                             }) => {
    const {
        showCamera,
        capturedImage,
        videoRef,
        canvasRef,
        startCamera,
        captureImage,
        handleFileUpload,
        resetCapture,
        goBack,
    } = useCapture();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!capturedImage) return;

        setLoading(true);
        const documentData = { image: capturedImage };
        const documentType = title.toLowerCase().replace(/\s/g, "-");

        try {
            await RequestToStoreKycDocument(documentData, documentType, null);
            alert(`${title} information submitted successfully`);
        } catch (error) {
            alert(`Failed to submit ${title} information`);
        } finally {
            setLoading(false);
            resetCapture();
            onClose();
        }
    };

    const closePopup = () => {
        resetCapture();
        onClose();
    };

    const renderContent = () => {
        if (!showCamera && !capturedImage) {
            return (
                <>
                    <p className="text-gray-600 text-center mb-4">
                        Follow these steps to complete your identity verification securely.
                    </p>
                    <div className="flex justify-center mb-4">
                        <img
                            className="w-full h-auto rounded-lg"
                            src={sampleImageSrc}
                            alt={`Example of a ${title}`}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
                    <p className="text-gray-600 text-center mb-4">{description}</p>
                    <button
                        onClick={startCamera}
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200 mb-2"
                    >
                        Open Camera
                    </button>
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
                </>
            );
        } else if (showCamera) {
            return (
                <>
                    <video ref={videoRef} autoPlay className="w-full rounded-lg">
                        <track kind="captions" label="Camera feed" />
                    </video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <button
                        onClick={captureImage}
                        className="w-full mt-4 bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition duration-200"
                    >
                        Capture Image
                    </button>
                </>
            );
        } else if (capturedImage) {
            return (
                <>
                    <img
                        src={capturedImage}
                        alt="Captured ID"
                        className="w-full rounded-lg mb-4"
                    />
                    <button
                        onClick={resetCapture}
                        className="w-full bg-yellow-500 text-white font-bold py-2 rounded-xl hover:bg-yellow-600 transition duration-200 mb-2"
                    >
                        Retake
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </>
            );
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-11/12 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={goBack}
                        className="text-gray-600 hover:text-gray-800 transition"
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
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
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
                    Let’s Verify Your Identity
                </h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default IdCapture;