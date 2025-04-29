import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLocation } from "react-router-dom";

// Routes where KYC reminder should appear
const INCLUDED_ROUTES = ["/dashboard"];

export const useKYCReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);
  const location = useLocation();

  useEffect(() => {
    // Only show reminder if KYC is not started (null) and on included routes
    if (
      kycCert == null &&
      status !== "PENDING" &&
      INCLUDED_ROUTES.includes(location.pathname)
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
