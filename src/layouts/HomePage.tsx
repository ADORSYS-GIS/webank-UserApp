import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";

const DashboardPage = lazy(
  () => import("@features/dashboard/pages/DashboardPage"),
);
const OnboardingPage = lazy(() => import("@shared/pages/HomePage"));

const HomePage = () => {
  const accountId = useSelector((state: RootState) => state.account.accountId);

  return (
    <Suspense fallback={<div>Loading home page...</div>}>
      {accountId ? <DashboardPage /> : <OnboardingPage />}
    </Suspense>
  );
};

export default HomePage;
