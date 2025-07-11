import Layout from "@shared/components/Layout";
import Header from "@shared/components/Header";
import KycCertChecker from "@features/kyc/pages/KycCertChecker";
import { Toaster } from "sonner";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import BottomNavigation from "@shared/components/BottomNavigation";
import BottomSheet from "@shared/components/SideBar";
import KYCReminderPopup from "@shared/components/KYCReminderPopup";
import { useKYCReminder } from "@features/kyc/hooks/useKYCReminder";
import { useAccountStore } from "@state/accountStore";

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { accountId } = useAccountStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showReminder, handleClose } = useKYCReminder();

  // Check if onboarding is completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted === "true" && location.pathname === "/onboarding") {
      navigate({ to: "/" });
    }
  }, [location.pathname, navigate]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <Layout>
      <KycCertChecker />
      <Header />
      {/* Content wrapper with bottom padding */}
      <div className={`${accountId ? "pb-16" : ""}`}>
        {children}
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>

      {/* Bottom Navigation */}
      {accountId &&
        !["/onboarding", "/phone", "/phone/verification"].includes(
          location.pathname,
        ) && <BottomNavigation />}

      <BottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* KYC Reminder Popup */}
      {showReminder && <KYCReminderPopup onClose={handleClose} />}

      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 2000,
          className:
            "px-4 py-3 rounded-lg text-sm shadow-sm w-full animation-slideDown",
        }}
      />

      {/* Devtools */}
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </Layout>
  );
};

export default AppLayout;
