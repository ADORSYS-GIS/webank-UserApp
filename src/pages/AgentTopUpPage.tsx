import React from "react";
import { useLocation } from "react-router-dom";
import TopUpForm from "../components/TopUpForm";

const AgentTopUpPage: React.FC = () => {
  const location = useLocation();
  const { tellerAccountCert } = location.state || {};

  return <TopUpForm tellerAccountCert={tellerAccountCert} />;
};

export default AgentTopUpPage;
