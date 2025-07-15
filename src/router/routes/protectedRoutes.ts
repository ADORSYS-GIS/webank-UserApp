import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";

import AccountConfirmation from "@features/kyc/pages/AccountConfirmation";
import RecoveryToken from "@features/kyc/pages/RecoveryToken";
import AccountRecoveryScannerPage from "@features/kyc/pages/AccountRecoveryScannerPage";
import KycRecoveryPage from "@features/kyc/pages/KycRecoveryPage";
import KycVerificationPage from "@features/kyc/pages/KycVerificationPage";

// Create the protected parent route
const protectedParent = createRoute({
  getParentRoute: () => rootRoute,
  id: "protectedRoot",
  beforeLoad: ({ location }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        replace: true,
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// Define protected routes
export const protectedRoutesGroup = protectedParent.addChildren([
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/agency",
    component: KycVerificationPage,
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/account-recovery",
    component: KycRecoveryPage,
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/recovery/recovery-scanner",
    component: AccountRecoveryScannerPage,
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/recovery/account-confirmation",
    component: AccountConfirmation,
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/recovery/recoverytoken",
    component: RecoveryToken,
  }),
]);
