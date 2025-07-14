import { lazy, Suspense } from "react";
import { useAccountStore } from "@state/accountStore";

const DashboardPage = lazy(
  () => import("@features/dashboard/pages/DashboardPage"),
);
const OnboardingPage = lazy(() => import("@shared/pages/HomePage"));

const HomePage = () => {
  const { accountId } = useAccountStore();
  console.log(accountId);
  return (
    <Suspense fallback={<div>Loading home page...</div>}>
      {accountId ? <DashboardPage /> : <OnboardingPage />}
    </Suspense>
  );
};

export default HomePage;
