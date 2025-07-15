import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import AppLayout from "../../layouts/AppLayout";

import TopUpQRScannerPage from "@features/qr/pages/TopUpQRScannerPage";
import GeneralQRScannerPage from "@features/qr/pages/GeneralQRScannerPage";
import OfflineQRScannerPage from "@features/qr/pages/OfflineQRScannerPage";
import QRGenerator from "@features/qr/pages/Qrcode";

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
