import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLocation } from "react-router-dom";

// Routes where KYC reminder should not appear
const EXCLUDED_ROUTES = [
  "/",
  "/onboarding",
  "/settings",
  "/inputEmail",
  "/emailCode",
  "/kyc",
  "/loading",
  "/verification/id-card",
  "/verification/location",
  "/verification/passport",
  "/verification/driving-license",
  "/kyc/imgs",
];

export const useKYCReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);
  const location = useLocation();

  useEffect(() => {
    // Only show reminder if KYC is not started (null) and not on excluded routes
    if (
      kycCert == null &&
      status !== "PENDING" &&
      !EXCLUDED_ROUTES.includes(location.pathname)
    ) {
      setShowReminder(true);
    } else {
      setShowReminder(false);
    }
  }, [kycCert, status, location.pathname]);

  const handleClose = () => {
    setShowReminder(false);
  };

  return {
    showReminder,
    handleClose,
  };
};
