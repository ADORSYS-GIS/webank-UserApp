import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccountState {
  accountId: string | null;
  accountCert: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  documentStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  kycCert: string | null;
  emailStatus: "APPROVED" | null;
  phoneStatus: "APPROVED" | null;
  onboardingCompleted: boolean;
}

interface AccountActions {
  setAccountId: (accountId: string) => void;
  setAccountCert: (accountCert: string) => void;
  setStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  setDocumentStatus: (
    documentStatus: "PENDING" | "APPROVED" | "REJECTED",
  ) => void;
  setKycCert: (kycCert: string) => void;
  setEmailStatus: (emailStatus: "APPROVED") => void;
  setPhoneStatus: (phoneStatus: "APPROVED") => void;
  setOnboardingCompleted: (completed: boolean) => void;
  clearAccount: () => void;
}

type AccountStore = AccountState & AccountActions;

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      // Initial state
      accountId: null,
      accountCert: null,
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
      onboardingCompleted: false,

      // Actions
      setAccountId: (accountId) => set({ accountId }),
      setAccountCert: (accountCert) => set({ accountCert }),
      setStatus: (status) => set({ status }),
      setDocumentStatus: (documentStatus) => set({ documentStatus }),
      setKycCert: (kycCert) => set({ kycCert, status: "APPROVED" }),
      setEmailStatus: (emailStatus) => set({ emailStatus }),
      setPhoneStatus: (phoneStatus) => set({ phoneStatus }),
      setOnboardingCompleted: (completed) =>
        set({ onboardingCompleted: completed }),
      clearAccount: () =>
        set({
          accountId: null,
          accountCert: null,
          status: null,
          documentStatus: null,
          kycCert: null,
          emailStatus: null,
          phoneStatus: null,
          onboardingCompleted: false,
        }),
    }),
    {
      name: "accountState",
    },
  ),
);
