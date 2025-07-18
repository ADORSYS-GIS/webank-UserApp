import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";

// Import HomePage from the new file
import HomePage from "../../layouts/HomePage";

import AboutPage from "@shared/pages/AboutPage";
import AccountLoadingPage from "@shared/pages/AccountLoadingPage";
import ShareHandlerPage from "@shared/pages/ShareHandlerPage";
import AgentPage from "@features/teller/pages/AgentPage";
import AgentTopUpPage from "@features/teller/pages/AgentTopUpPage";
import TellerDashboard from "@features/teller/pages/TellerPage";
import ContactsPage from "@features/contacts/pages/ContactsPage";
import PaymentSelectionPage from "@features/transactions/pages/PaymentSelectionPage";
import SuccessPage from "@features/transactions/pages/SuccessPage";
import TopUpPage from "@features/transactions/pages/TopUpPage";
import OnboardingFlow from "@shared/components/OnboardingFlow";

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
    component: OnboardingFlow,
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
