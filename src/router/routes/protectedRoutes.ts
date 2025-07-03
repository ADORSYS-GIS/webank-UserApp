import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import { lazy } from "react";

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
    component: lazy(() => import("@features/kyc/pages/KycVerificationPage")),
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/account-recovery",
    component: lazy(() => import("@features/kyc/pages/KycRecoveryPage")),
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/recovery/recovery-scanner",
    component: lazy(() =>
      import("@features/kyc/pages/AccountRecoveryScannerPage")
    ),
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/recovery/account-confirmation",
    component: lazy(() =>
      import("@features/kyc/pages/AccountConfirmation")
    ),
  }),
  createRoute({
    getParentRoute: () => protectedParent,
    path: "/recovery/recoverytoken",
    component: lazy(() => import("@features/kyc/pages/RecoveryToken")),
  }),
]);