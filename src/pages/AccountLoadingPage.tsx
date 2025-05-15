import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccountId, setAccountCert } from "../slices/accountSlice";
import { RequestToCreateBankAccount } from "../services/keyManagement/requestService.ts";
import { toast } from "sonner";
import useInitialization from "../hooks/useInitialization.ts";
import { logEvent } from "../utils/analytics";

interface AccountLoadingPageProps {
  message?: string;
}

const AccountLoadingPage: React.FC<AccountLoadingPageProps> = ({
  message = "Please wait while we initiate the bank account process. This might take some time...",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { devCert, error } = useInitialization();

  useEffect(() => {
    const initializeAccount = async () => {
      try {
        if (error) {
          // Log initialization error
          logEvent('registration_failed', {
            error_type: 'initialization_error',
            error_message: error
          });
          throw new Error(error);
        }

        if (!devCert) {
          return; // Wait for devCert to be available
        }

        // Create bank account using device certificate
        const accountCreationResponse = await RequestToCreateBankAccount(
          devCert, // Use the devCert from initialization
        );

        if (
          accountCreationResponse.startsWith(
            "Bank account successfully created.",
          )
        ) {
          const accountId = accountCreationResponse.split("\n")[2];
          const accountCert = accountCreationResponse.split("\n")[4];

          // Store account details
          localStorage.setItem("accountId", accountId);
          localStorage.setItem("accountCert", accountCert);
          dispatch(setAccountId(accountId));
          dispatch(setAccountCert(accountCert));

          // Log sign-up success
          logEvent('registration success');

          // Redirect to dashboard
          navigate("/onboarding", {
            state: { accountId, accountCert },
          });
        } else {
          // Log account creation failure
          logEvent('registration_failed', {
            error_type: 'account_creation_failed',
            error_message: accountCreationResponse
          });
          throw new Error("Account creation failed");
        }
      } catch (error) {
        console.error("Error during account creation:", error);
        // Log general registration error
        logEvent('registration_failed', {
          error_type: 'general_error',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
        toast.error("Account creation failed. Please try again.");
        navigate("/");
      }
    };

    initializeAccount();
  }, [navigate, dispatch, devCert, error]);

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
