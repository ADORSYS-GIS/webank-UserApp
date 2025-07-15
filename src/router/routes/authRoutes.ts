import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";

import Login from "@features/auth/pages/Login";
import PhoneInput from "@features/auth/pages/PhoneInput";
import PhoneVerification from "@features/auth/pages/PhoneVerification";

const authParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AppLayout,
});

const authRoutes = [
  createRoute({
    path: "/login",
    getParentRoute: () => authParentRoute,
    component: Login,
  }),
  createRoute({
    path: "/phone",
    getParentRoute: () => authParentRoute,
    component: PhoneInput,
  }),
  createRoute({
    path: "/phone/verification",
    getParentRoute: () => authParentRoute,
    component: PhoneVerification,
  }),
];

export const authRoutesGroup = authParentRoute.addChildren(authRoutes);
