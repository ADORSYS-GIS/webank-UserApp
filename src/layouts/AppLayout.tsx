import Layout from "@shared/components/Layout";
import Header from "@shared/components/Header";
import KycCertChecker from "@features/kyc/pages/KycCertChecker";
import { Toaster } from "sonner";
import { ReactNode, Suspense } from "react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // You can add global UI logic here if needed
  return (
    <Layout>
      <KycCertChecker />
      <Header />
      {children}
      <Toaster position="top-center" />
      {/* Add global popups, reminders, etc. here */}
      {/* …your header, etc… */}
      <Suspense fallback={<div>Loading…</div>}>
        <Outlet />
      </Suspense>

      {/* Devtools tucked in under your layout */}
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </Layout>
  );
};

export default AppLayout;
