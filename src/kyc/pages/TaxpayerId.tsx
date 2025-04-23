// src/kyc/pages/TaxpayerId.tsx
import React from "react";
import IdCapture from "../components/IdCapture";

interface TaxpayerProps {
  onClose: () => void;
}

const TaxpayerId: React.FC<TaxpayerProps> = ({ onClose }) => {
  return (
    <IdCapture
      onClose={onClose}
      title="Taxpayer Document"
      description="Please take a clear picture of your Taxpayer Identification Document."
      sampleImageSrc="/Tax.png"
    />
  );
};

export default TaxpayerId;
