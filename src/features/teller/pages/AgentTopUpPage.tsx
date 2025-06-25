import React from "react";
import { useRouterState } from '@tanstack/react-router';
import TopUpForm from "@features/transactions/components/TopUpForm";

const AgentTopUpPage: React.FC = () => {
  const location = useRouterState().location;
  const { tellerAccountCert } = location.state as { tellerAccountCert?: string };

  return <TopUpForm tellerAccountCert={tellerAccountCert ?? ""} />;
};

export default AgentTopUpPage;
