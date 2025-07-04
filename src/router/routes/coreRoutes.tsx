import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";
import { lazy } from "react";

// Import HomePage from the new file
import HomePage from "../../layouts/HomePage";

const AboutPage = lazy(() => import("@shared/pages/AboutPage"));
const AccountLoadingPage = lazy(
  () => import("@shared/pages/AccountLoadingPage"),
);
const ShareHandlerPage = lazy(() => import("@shared/pages/ShareHandlerPage"));
const AgentPage = lazy(() => import("@features/teller/pages/AgentPage"));
const AgentTopUpPage = lazy(
  () => import("@features/teller/pages/AgentTopUpPage"),
);
const TellerDashboard = lazy(() => import("@features/teller/pages/TellerPage"));
const ContactsPage = lazy(
  () => import("@features/contacts/pages/ContactsPage"),
);
const PaymentSelectionPage = lazy(
  () => import("@features/transactions/pages/PaymentSelectionPage"),
);
const SuccessPage = lazy(
  () => import("@features/transactions/pages/SuccessPage"),
);
const TopUpPage = lazy(() => import("@features/transactions/pages/TopUpPage"));

const coreParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "core",
  component: AppLayout,
});

const coreRoutes = [
  createRoute({
    path: "/",
    getParentRoute: () => coreParentRoute,
    component: HomePage, // Use the imported HomePage
  }),
  createRoute({
    path: "/onboarding",
    getParentRoute: () => coreParentRoute,
    component: lazy(() => import("@shared/components/OnboardingFlow")),
  }),
  createRoute({
    path: "/about",
    getParentRoute: () => coreParentRoute,
    component: AboutPage,
  }),
  createRoute({
    path: "/loading",
    getParentRoute: () => coreParentRoute,
    component: AccountLoadingPage,
  }),
  createRoute({
    path: "/share-handler",
    getParentRoute: () => coreParentRoute,
    component: ShareHandlerPage,
  }),
  createRoute({
    path: "/agent",
    getParentRoute: () => coreParentRoute,
    component: AgentPage,
  }),
  createRoute({
    path: "/agent-topup",
    getParentRoute: () => coreParentRoute,
    component: AgentTopUpPage,
  }),
  createRoute({
    path: "/teller",
    getParentRoute: () => coreParentRoute,
    component: TellerDashboard,
  }),
  createRoute({
    path: "/contacts",
    getParentRoute: () => coreParentRoute,
    component: ContactsPage,
  }),
  createRoute({
    path: "/payment-selection",
    getParentRoute: () => coreParentRoute,
    component: PaymentSelectionPage,
  }),
  createRoute({
    path: "/success",
    getParentRoute: () => coreParentRoute,
    component: SuccessPage,
  }),
  createRoute({
    path: "/top-up",
    getParentRoute: () => coreParentRoute,
    component: TopUpPage,
  }),
];

export const coreRoutesGroup = coreParentRoute.addChildren(coreRoutes);
