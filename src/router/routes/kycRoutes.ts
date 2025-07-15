import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";

import SettingsPage from "@features/kyc/pages/SettingsPage";
import EmailVerification from "@features/kyc/pages/emailVerification";
import EmailCode from "@features/kyc/pages/emailCode";
import IdentityVerificationPage from "@features/kyc/pages/IdentityVerificationPage";
import IDCardForm from "@features/kyc/pages/IDCardForm";
import DriverLicenseForm from "@features/kyc/pages/DriverLicenseForm";
import PassportForm from "@features/kyc/pages/PassportForm";
import LocationComponent from "@features/kyc/components/LocationComponent";
import RecoverAccountPage from "@features/kyc/pages/RecoverAccountPage";
import GuidelinesPage from "@features/kyc/guidelines/GuidelinesPage";
import MapConfirmation from "@features/kyc/components/MapConfirmation";
import DocumentImages from "@features/kyc/pages/DocumentImages";

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
