import { createRootRoute, Outlet } from "@tanstack/react-router";
import { coreRoutesGroup } from "./coreRoutes";
import { authRoutesGroup } from "./authRoutes";
import { kycRoutesGroup } from "./kycRoutes";
import { qrRoutesGroup } from "./qrRoutes";
import { protectedRoutesGroup } from "./protectedRoutes";
import { Navigate } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => <Navigate to="/" replace />,
});

export const routeTree = rootRoute.addChildren([
  coreRoutesGroup,
  authRoutesGroup,
  kycRoutesGroup,
  qrRoutesGroup,
  protectedRoutesGroup,
]);