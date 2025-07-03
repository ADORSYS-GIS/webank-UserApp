import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import { lazy } from "react";
import type { LazyExoticComponent, ComponentType } from "react";

const NotFoundPage = lazy(() => import("@shared/pages/NotFoundPage"));

export const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$not-found",
  component: NotFoundPage as unknown as LazyExoticComponent<ComponentType<unknown>>,
});