import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLocation } from "react-router-dom";

// Routes where KYC reminder should appear
const INCLUDED_ROUTES = ["/dashboard"];
const SESSION_STORAGE_KEY = "kycReminderShown";

export const useKYCReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);
  const location = useLocation();

  useEffect(() => {
    // Check if this is a new browser instance
    const isNewInstance = !sessionStorage.getItem("browserInstance");
    if (isNewInstance) {
      // Clear any existing reminder flags
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      // Mark this as a new browser instance
      sessionStorage.setItem("browserInstance", "true");
    }

    // Only show reminder if:
    // 1. KYC is not started (null)
    // 2. Not in PENDING status
    // 3. On included routes
    // 4. Not shown in this session yet
    if (
      kycCert == null &&
      status !== "PENDING" &&
      INCLUDED_ROUTES.includes(location.pathname) &&
      !sessionStorage.getItem(SESSION_STORAGE_KEY)
    ) {
      setShowReminder(true);
      // Mark as shown for this session
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
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
