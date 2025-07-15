import { useState, useEffect } from "react";
import { useAccountStore } from "@state/accountStore";
import { useRouterState } from "@tanstack/react-router";

// Routes where KYC reminder should appear
const INCLUDED_ROUTES = ["/"];
const SESSION_STORAGE_KEY = "kycReminderShown";

export const useKYCReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const { accountId, kycCert, status } = useAccountStore();
  const location = useRouterState().location;

  useEffect(() => {
    // Check if this is a new browser instance
    const isNewInstance = !sessionStorage.getItem("browserInstance");
    if (isNewInstance) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.setItem("browserInstance", "true");
    }

    // Only show reminder if:
    // 1. Account is not null (NOT on the onboarding page)
    // 2. KYC is not started (null)
    // 3. Not in PENDING status
    // 4. On included routes
    // 5. Not shown in this session yet
    if (
      accountId &&
      kycCert == null &&
      status == null &&
      INCLUDED_ROUTES.includes(location.pathname) &&
      !sessionStorage.getItem(SESSION_STORAGE_KEY)
    ) {
      setShowReminder(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } else {
      setShowReminder(false);
    }
  }, [kycCert, status, location.pathname, accountId]);

  const handleClose = () => {
    setShowReminder(false);
  };

  return {
    showReminder,
    handleClose,
  };
};
