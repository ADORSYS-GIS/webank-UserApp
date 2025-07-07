import React from "react";
import TopUpForm from "@features/transactions/components/TopUpForm";
import { useAgentTopUpPage } from "../hooks/useAgentTopUpPage";

const AgentTopUpPage: React.FC = () => {
  const { tellerAccountCert } = useAgentTopUpPage();
  return <TopUpForm tellerAccountCert={tellerAccountCert} />;
};

export default AgentTopUpPage;
