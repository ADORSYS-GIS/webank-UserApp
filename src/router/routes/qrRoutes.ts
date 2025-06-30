import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";
import { lazy } from "react";

const TopUpQRScannerPage = lazy(
  () => import("@features/qr/pages/TopUpQRScannerPage"),
);
const GeneralQRScannerPage = lazy(
  () => import("@features/qr/pages/GeneralQRScannerPage"),
);
const OfflineQRScannerPage = lazy(
  () => import("@features/qr/pages/OfflineQRScannerPage"),
);
const QRGenerator = lazy(() => import("@features/qr/pages/Qrcode"));

const qrParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "qr",
  component: AppLayout,
});

const qrRoutes = [
  createRoute({
    path: "/qr-scan",
    getParentRoute: () => qrParentRoute,
    component: GeneralQRScannerPage,
  }),
  createRoute({
    path: "/qr-scan/top-up",
    getParentRoute: () => qrParentRoute,
    component: TopUpQRScannerPage,
  }),
  createRoute({
    path: "/qr-scan/offline",
    getParentRoute: () => qrParentRoute,
    component: OfflineQRScannerPage,
  }),
  createRoute({
    path: "/qrcode",
    getParentRoute: () => qrParentRoute,
    component: QRGenerator,
  }),
];

export const qrRoutesGroup = qrParentRoute.addChildren(qrRoutes);
