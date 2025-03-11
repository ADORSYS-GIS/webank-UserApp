import React, { useState, useRef } from "react";

const SelfieId: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false); // Controls camera visibility
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Stores captured/uploaded image
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 📸 Start Camera
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // 📷 Capture Image from Camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png"); // Convert to image format
        setCapturedImage(imageUrl);

        // Stop camera stream after capture
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // 📂 Upload Image from Device
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔄 Reset to Initial State
  const resetCapture = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  // ❌ Close Popup
  const closePopup = () => {
    resetCapture(); // Reset everything
    // You can add additional logic to close the modal if needed
  };

  // ⬅ Go Back to Previous Step
  const goBack = () => {
    if (showCamera) {
      setShowCamera(false); // Go back from camera mode
    } else {
      resetCapture(); // If in final step, reset to initial screen
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-11/12 max-w-md">
        
        {/* 🔹 Header with Back & Close Buttons */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            {/* Back Button ⬅ */}
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
            {/* Close Button ❌ */}
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

        {/* 🔹 Main Content */}
        <h2 className="text-lg font-semibold text-center mb-2">
          Let’s Verify Your Identity
        </h2>

        {!showCamera && !capturedImage ? (
          <>
            <p className="text-gray-600 text-center mb-4">
              Follow these steps to complete your identity verification securely.
            </p>

            {/* ID Card Sample Image */}
            <div className="flex justify-center mb-4">
              <img
                className="w-full h-auto rounded-lg"
                src="./public/selfie-id.png"
                alt="Example of a Selfie ID card"
              />
            </div>

            <h3 className="text-lg font-medium text-center mb-2">Selfie ID</h3>
            <p className="text-gray-600 text-center mb-4">
              Please take a clear picture of a selfie of you holding your ID card or upload from your device.
            </p>

            {/* ✅ Action Buttons */}
            <button
              onClick={startCamera}
              className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200 mb-2"
            >
              Open Camera
            </button>

            <label
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition duration-200 cursor-pointer block text-center"
            >
              Upload from Device
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </>
        ) : showCamera ? (
          <>
            {/* 📸 Live Camera Feed */}
            <video ref={videoRef} autoPlay className="w-full rounded-lg"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>

            <button
              onClick={captureImage}
              className="w-full mt-4 bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition duration-200"
            >
              Capture Image
            </button>
          </>
        ) : (
          capturedImage && (
            <>
              {/* 🖼 Display Captured/Uploaded Image */}
              <img src={capturedImage} alt="Captured ID" className="w-full rounded-lg mb-4" />

              {/* 🔄 Retake & Submit Buttons */}
              <button
                onClick={resetCapture}
                className="w-full bg-yellow-500 text-white font-bold py-2 rounded-xl hover:bg-yellow-600 transition duration-200 mb-2"
              >
                Retake
              </button>

              <button
                className="w-full bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition duration-200"
              >
                Submit
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SelfieId;
