import { useLocation } from "react-router-dom";

export function useAgentTopUpPage() {
  const location = useLocation();
  const { tellerAccountCert } = location.state || {};
  return { tellerAccountCert };
}
