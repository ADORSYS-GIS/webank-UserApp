import { createRootRoute, Outlet } from "@tanstack/react-router";
import { coreRoutesGroup } from "./coreRoutes";
import { authRoutesGroup } from "./authRoutes";
import { kycRoutesGroup } from "./kycRoutes";
import { qrRoutesGroup } from "./qrRoutes";
import { protectedRoutesGroup } from "./protectedRoutes";
import { errorRoute } from "./errorRoutes";
import React from "react";

export const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: function NotFound(): React.ReactElement {
    window.location.href = "/$not-found";
    return React.createElement(React.Fragment);
  },
});

export const routeTree = rootRoute.addChildren([
  coreRoutesGroup,
  authRoutesGroup,
  kycRoutesGroup,
  qrRoutesGroup,
  protectedRoutesGroup,
  errorRoute,
]);
