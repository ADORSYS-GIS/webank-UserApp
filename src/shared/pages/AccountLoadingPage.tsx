import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountStore } from "@state/accountStore";
import { useAccountRegistrationServicePostApiRegistration } from "@openapi/generated/obs/queries/queries";
import { toast } from "sonner";
import useInitialization from "../hooks/useInitialization";

interface AccountLoadingPageProps {
  message?: string;
}

const AccountLoadingPage: React.FC<AccountLoadingPageProps> = ({
  message = "Please wait while we initiate the bank account process. This might take some time...",
}) => {
  const navigate = useNavigate();
  const { setAccountId, setAccountCert } = useAccountStore();
  const { devCert, error } = useInitialization();
  const accountRegistrationMutation =
    useAccountRegistrationServicePostApiRegistration();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) return;

    if (error) {
      toast.error(error);
      navigate("/");
      return;
    }

    if (!devCert || typeof devCert !== "string" || devCert.trim() === "") {
      // devCert not ready yet; wait for it
      return;
    }

    const devCertFromStorage = localStorage.getItem("devCert");
    if (!devCertFromStorage || devCertFromStorage !== devCert) {
      toast.error(
        "Device certificate missing or out of sync. Please restart onboarding.",
      );
      console.error(
        "devCert in state:",
        devCert,
        "devCert in localStorage:",
        devCertFromStorage,
      );
      navigate("/");
      return;
    }

    const register = async () => {
      if (hasRegistered.current) return;
      hasRegistered.current = true;

      try {
        console.log("Proceeding to registration with devCert:", devCert);
        const response = await accountRegistrationMutation.mutateAsync();

        const accountId = response?.accountId ?? "";
        const accountCert = response?.message?.split("\n")[4];

        if (accountId && accountCert) {
          setAccountId(accountId);
          setAccountCert(accountCert);
          localStorage.setItem("accountId", accountId);
          localStorage.setItem("accountCert", accountCert);
          navigate("/onboarding", {
            state: { accountId, accountCert },
          });
        } else {
          throw new Error(
            "Account creation failed: Missing accountId or accountCert",
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        toast.error(`Registration failed: ${errorMessage}`);
        console.error("Registration error:", err);
        navigate("/");
      }
    };

    register();
  }, [
    devCert,
    error,
    navigate,
    setAccountId,
    setAccountCert,
    accountRegistrationMutation,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-700 text-center px-4">
        {message}
      </h1>
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-40 w-40 border-t-4 border-b-4 border-purple-500"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          alt="Thinking Avatar"
          className="absolute rounded-full h-28 w-28"
        />
      </div>
    </div>
  );
};

export default AccountLoadingPage;
