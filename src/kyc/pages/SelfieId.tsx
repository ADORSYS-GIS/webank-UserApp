// src/kyc/pages/SelfieId.tsx
import React from "react";
import IdCapture from "../components/IdCapture";

interface SelfieProps {
  onClose: () => void;
  onFileCaptured: (file: File | Blob) => void;
}

const SelfieId: React.FC<SelfieProps> = ({ onClose, onFileCaptured }) => {
  return (
    <IdCapture
      onClose={onClose}
      onFileCaptured={onFileCaptured}
      title="Selfie ID"
      description="Please take a clear picture of a selfie of you holding your ID card or upload from your device."
      sampleImageSrc="/selfie-id.png"
      defaultFacingMode="user"
    />
  );
};

export default SelfieId;
