// src/kyc/pages/FrontId.tsx
import React from "react";
import IdCapture from "../components/IdCapture";

interface FrontIdProps {
  onClose: () => void;
  onFileCaptured: (file: File | Blob) => void;
}

const FrontId: React.FC<FrontIdProps> = ({ onClose, onFileCaptured }) => {
  return (
    <IdCapture
      onClose={onClose}
      onFileCaptured={onFileCaptured}
      title="Front ID"
      description="Please take a clear picture of the front of your ID card or upload from your device."
      sampleImageSrc="/front-id.png"
    />
  );
};

export default FrontId;
