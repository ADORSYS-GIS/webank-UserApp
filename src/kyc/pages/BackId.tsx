// src/kyc/pages/BackId.tsx
import React from "react";
import IdCapture from "../components/IdCapture";

interface BackIdProps {
  onClose: () => void;
  onFileCaptured: (file: File | Blob) => void;
}

const BackId: React.FC<BackIdProps> = ({ onClose }) => {
  return (
    <IdCapture
      onClose={onClose}
      title="Back ID"
      description="Please take a clear picture of the back of your ID card or upload from your device."
      sampleImageSrc="/back-id.png"
    />
  );
};

export default BackId;
