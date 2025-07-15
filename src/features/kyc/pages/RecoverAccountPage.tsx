import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAccountStore } from "@state/accountStore";
import { toast } from "sonner";
import { useAccountRecoveryServicePostApiPrsKycRecoveryValidate } from "@openapi/generated/prs/queries/queries";
import { useAccountRecoveryServicePostApiAccountsRecovery } from "@openapi/generated/obs/queries/queries";
import { Repeat, CreditCard, ArrowLeft, Key } from "react-feather";
import { AccountRecoveryResponse } from "@openapi/generated/prs/requests/types.gen";

const RecoverAccountPage: React.FC = () => {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const { accountId, accountCert, setAccountId, setAccountCert, setKycCert } =
    useAccountStore();

  const supportPhoneNumber = "+237654066316";
  const { mutate: submitRecoveryToken } =
    useAccountRecoveryServicePostApiPrsKycRecoveryValidate();
  const { mutate: recoverAccountCert } =
    useAccountRecoveryServicePostApiAccountsRecovery();

  const handleTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
    localStorage.setItem("recoveryToken", event.target.value);
  };

  const handleKYCRecovery = () => {
    const accountIdText = accountId ? `Account ID: ${accountId}\n\n` : "";
    const customMessage = encodeURIComponent(
      `Welcome to KYC Recovery!\n\n` + accountIdText + `My name is : `,
    );
    const whatsappLink = `https://api.whatsapp.com/send?phone=${supportPhoneNumber}&text=${customMessage}`;
    window.open(whatsappLink, "_blank");
  };

  const handleTokenSubmit = () => {
    if (!token.trim()) {
      toast.error("Please enter a valid recovery token.");
      return;
    }
    if (!accountId || !accountCert) {
      toast.error("Account information is missing.");
      return;
    }
    submitRecoveryToken(
      {
        requestBody: {
          newAccountId: accountId, // OpenAPI expects oldAccountId
          // accountCert is not in TokenRequest, but if needed, add as custom field
        },
      },
      {
        onSuccess: (data: AccountRecoveryResponse) => {
          const { accountId, kycCertificate } = data;

          // Values are valid non-empty strings
          setAccountId(accountId);
          if (kycCertificate) {
            setKycCert(kycCertificate);
          }
          setShowTokenInput(false);
          setShowConfirmation(true);
        },
        onError: (error: unknown) => {
          toast.error(
            "Token submission failed: " +
              (error instanceof Error ? error.message : String(error)),
          );
        },
      },
    );
  };

  const handleYesClick = () => {
    if (!accountId) {
      toast.error("Account information is missing.");
      return;
    }
    recoverAccountCert(
      {
        requestBody: { accountId: accountId }, // OpenAPI expects newAccountId
      },
      {
        onSuccess: (data: string) => {
          if (data?.includes("Failed")) {
            toast.error(
              "Failed to recover account certificate. Please try again.",
            );
          } else if (data?.startsWith("ey")) {
            setAccountCert(data);
            toast.success("Account recovery successful!");
            setTimeout(() => {
              navigate({ to: "/" });
            }, 1500);
          }
          setShowConfirmation(false);
        },
        onError: (error: unknown) => {
          toast.error(
            "Account cert recovery failed: " +
              (error instanceof Error ? error.message : String(error)),
          );
          setShowConfirmation(false);
        },
      },
    );
  };

  const handleCancel = () => {
    navigate({ to: "/settings" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go Back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold mx-auto pr-10">
            Account Recovery
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Repeat className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Recover Your Account</h2>
          <p className="text-gray-600 text-sm">
            Choose one of the options below to recover your account access
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleKYCRecovery}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center hover:border-blue-500 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Initiate KYC Recovery</h3>
              <p className="text-sm text-gray-600">
                Contact support through WhatsApp
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowTokenInput(true)}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center hover:border-blue-500 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Key className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Input Recovery Token</h3>
              <p className="text-sm text-gray-600">
                Enter the token sent to you
              </p>
            </div>
          </button>
        </div>
      </main>

      {/* Token Input Bottom Sheet */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-end justify-end transition-opacity duration-300">
          <div className="w-full md:max-w-[650px] md:mx-auto">
            <div className="w-full bg-white rounded-t-2xl p-6 shadow-lg z-50 transform transition-transform duration-300 animate-slide-up">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Enter Recovery Token</h2>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={token}
                    onChange={handleTokenInput}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Recovery Token"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowTokenInput(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTokenSubmit}
                    className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Bottom Sheet */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-end justify-end transition-opacity duration-300">
          <div className="w-full md:max-w-[650px] md:mx-auto">
            <div className="w-full bg-white rounded-t-2xl p-6 shadow-lg z-50 transform transition-transform duration-300 animate-slide-up">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold">Confirm Recovery</h2>
                <p className="text-gray-600 mt-2">
                  Are you sure you want to recover this account?
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleYesClick}
                  className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoverAccountPage;
