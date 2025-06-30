import Layout from "@shared/components/Layout";
import Header from "@shared/components/Header";
import KycCertChecker from "@features/kyc/pages/KycCertChecker";
import { Toaster } from "sonner";
import { ReactNode } from "react";

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
    </Layout>
  );
};

export default AppLayout;
