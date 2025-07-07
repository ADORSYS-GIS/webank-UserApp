import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getProjectEnvVariables } from "@shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();
const PASSWORD = `${envVariables.VITE_WEBANK_TELLER_PASSWORD}`;

export function useLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo ?? "/teller";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login successful!");
      setTimeout(() => {
        navigate(redirectTo);
      }, 3000);
    } else {
      toast.error("Invalid password. Please try again.");
      setError("Invalid password. Please try again.");
    }
  };

  const close = () => {
    navigate("/dashboard");
  };

  return {
    password,
    setPassword,
    error,
    handleSubmit,
    close,
  };
}
