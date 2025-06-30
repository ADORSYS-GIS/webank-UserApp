import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { useRouterState } from "@tanstack/react-router";

// Routes where KYC reminder should appear
const INCLUDED_ROUTES = ["/dashboard"];
const SESSION_STORAGE_KEY = "kycReminderShown";

export const useKYCReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);
  const location = useRouterState().location;

  useEffect(() => {
    // Check if this is a new browser instance
    const isNewInstance = !sessionStorage.getItem("browserInstance");
    if (isNewInstance) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
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
