import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLocation } from "react-router-dom";

// Check once per day
const CHECK_INTERVAL = 10 * 60 * 60 * 1000; // 10 hours
// const CHECK_INTERVAL = 5 * 1000; // 5 seconds

// Routes where KYC reminder should not appear
const EXCLUDED_ROUTES = [
  "/",
  "/onboarding",
  "/settings",
  "/inputEmail",
  "/emailCode",
  "/kyc",
  "/verification/id-card",
  "/verification/location",
  "/verification/passport",
  "/verification/driving-license",
  "/kyc/imgs",
];

const isWithinReminderHours = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 22; // 6 AM to 10 PM
};

export const useKYCReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const status = useSelector((state: RootState) => state.account.status);
  const location = useLocation();

  useEffect(() => {
    // Only show reminder if KYC is not completed (null or REJECTED) and not on excluded routes
    if (
      (kycCert == null || status === "REJECTED") &&
      !EXCLUDED_ROUTES.includes(location.pathname)
    ) {
      const checkReminder = () => {
        // Only proceed if within reminder hours
        if (!isWithinReminderHours()) {
          setShowReminder(false);
          return;
        }

        setShowReminder(true);
      };

      // Check immediately
      checkReminder();

      // Set up interval to check every 10 hours
      const interval = setInterval(checkReminder, CHECK_INTERVAL);

      return () => clearInterval(interval);
    } else {
      // Hide reminder if on excluded routes or KYC is completed/pending
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
