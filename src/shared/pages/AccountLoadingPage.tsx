import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccountId, setAccountCert } from "@state/accountSlice";
import { useAccountRegistrationServicePostApiRegistration } from "@openapi/generated/obs/queries/queries";
import { toast } from "sonner";
import useInitialization from "../hooks/useInitialization.ts";

interface AccountLoadingPageProps {
  message?: string;
}

const AccountLoadingPage: React.FC<AccountLoadingPageProps> = ({
  message = "Please wait while we initiate the bank account process. This might take some time...",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    // Defensive check: ensure devCert is in localStorage before registration
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
    // Log for debugging
    console.log("Proceeding to registration with devCert:", devCert);

    const register = async () => {
      try {
        hasRegistered.current = true;
        const response = await accountRegistrationMutation.mutateAsync();
        const accountId = response?.accountId ?? "";
        const accountCert = response?.accountCertificate ?? "";
        if (accountId && accountCert) {
          localStorage.setItem("accountId", accountId);
          localStorage.setItem("accountCert", accountCert);
          dispatch(setAccountId(accountId));
          dispatch(setAccountCert(accountCert));
          navigate("/onboarding", {
            state: { accountId, accountCert },
          });
        } else {
          throw new Error("Account creation failed");
        }
      } catch (e) {
        console.error("Account creation error:", e);
        toast.error("Account creation failed. Please try again.");
        navigate("/");
      }
    };
    register();
  }, [devCert, error, accountRegistrationMutation, dispatch, navigate]);

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
