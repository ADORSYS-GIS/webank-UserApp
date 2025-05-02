import React from "react";
import { useLocation } from "react-router-dom";
import TopUpForm from "../components/TopUpForm";

const AgentTopUpPage: React.FC = () => {
  const location = useLocation();
  const { tellerAccountId, tellerAccountCert } = location.state || {};

  return (
    <TopUpForm
      tellerAccountId={tellerAccountId}
      tellerAccountCert={tellerAccountCert}
    />
  );
};

export default AgentTopUpPage;
