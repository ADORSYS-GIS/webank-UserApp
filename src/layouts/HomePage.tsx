import { useAccountStore } from "@state/accountStore";

import DashboardPage from "@features/dashboard/pages/DashboardPage";
import OnboardingPage from "@shared/pages/HomePage";

const HomePage = () => {
  const { accountId } = useAccountStore();
  console.log(accountId);
  return accountId ? <DashboardPage /> : <OnboardingPage />;
};

export default HomePage;
