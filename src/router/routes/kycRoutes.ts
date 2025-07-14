import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";
import { lazy } from "react";

const SettingsPage = lazy(() => import("@features/kyc/pages/SettingsPage"));
const EmailVerification = lazy(
  () => import("@features/kyc/pages/emailVerification"),
);
const EmailCode = lazy(() => import("@features/kyc/pages/emailCode"));
const IdentityVerificationPage = lazy(
  () => import("@features/kyc/pages/IdentityVerificationPage"),
);
const IDCardForm = lazy(() => import("@features/kyc/pages/IDCardForm"));
const DriverLicenseForm = lazy(
  () => import("@features/kyc/pages/DriverLicenseForm"),
);
const PassportForm = lazy(() => import("@features/kyc/pages/PassportForm"));
const LocationComponent = lazy(
  () => import("@features/kyc/components/LocationComponent"),
);
const RecoverAccountPage = lazy(
  () => import("@features/kyc/pages/RecoverAccountPage"),
);
const GuidelinesPage = lazy(
  () => import("@features/kyc/guidelines/GuidelinesPage"),
);
const MapConfirmation = lazy(
  () => import("@features/kyc/components/MapConfirmation"),
);
const DocumentImages = lazy(() => import("@features/kyc/pages/DocumentImages"));

const kycParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "kyc",
  component: AppLayout,
});

const kycRoutes = [
  createRoute({
    path: "/settings",
    getParentRoute: () => kycParentRoute,
    component: SettingsPage,
  }),
  createRoute({
    path: "/inputEmail",
    getParentRoute: () => kycParentRoute,
    component: EmailVerification,
  }),
  createRoute({
    path: "/emailCode",
    getParentRoute: () => kycParentRoute,
    component: EmailCode,
  }),
  createRoute({
    path: "/kyc",
    getParentRoute: () => kycParentRoute,
    component: IdentityVerificationPage,
  }),
  createRoute({
    path: "/verification/id-card",
    getParentRoute: () => kycParentRoute,
    component: IDCardForm,
  }),
  createRoute({
    path: "/verification/location",
    getParentRoute: () => kycParentRoute,
    component: LocationComponent,
  }),
  createRoute({
    path: "/verification/passport",
    getParentRoute: () => kycParentRoute,
    component: PassportForm,
  }),
  createRoute({
    path: "/recoverAccount",
    getParentRoute: () => kycParentRoute,
    component: RecoverAccountPage,
  }),
  createRoute({
    path: "/guidelines",
    getParentRoute: () => kycParentRoute,
    component: GuidelinesPage,
  }),
  createRoute({
    path: "/verification/driving-license",
    getParentRoute: () => kycParentRoute,
    component: DriverLicenseForm,
  }),
  createRoute({
    path: "/map-confirmation",
    getParentRoute: () => kycParentRoute,
    component: MapConfirmation,
  }),
  createRoute({
    path: "/kyc/imgs",
    getParentRoute: () => kycParentRoute,
    component: DocumentImages,
  }),
];

export const kycRoutesGroup = kycParentRoute.addChildren(kycRoutes);
