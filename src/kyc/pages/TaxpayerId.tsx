// src/kyc/pages/TaxpayerId.tsx
import React from "react";
import IdCapture from "../components/IdCapture";

interface TaxpayerProps {
  onClose: () => void;
  onFileCaptured: (file: File | Blob) => void;
}

const TaxpayerId: React.FC<TaxpayerProps> = ({ onClose, onFileCaptured }) => {
  return (
    <IdCapture
      onClose={onClose}
      onFileCaptured={onFileCaptured}
      title="Taxpayer Document"
      description="Please take a clear picture of your Taxpayer Identification Document."
      sampleImageSrc="/Tax.png"
      uploadAccept="image/*,application/pdf"
      defaultFacingMode="environment"
    />
  );
};

export default TaxpayerId;
