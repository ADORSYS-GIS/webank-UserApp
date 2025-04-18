import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  accountId: string | null;
  accountCert: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  kycCert: string | null;
  emailStatus: "APPROVED" | null; // Add email status
}

const persistedState = localStorage.getItem("accountState")
  ? JSON.parse(localStorage.getItem("accountState")!)
  : {
      accountId: null,
      accountCert: null,
      status: null,
      kycCert: null,
      emailStatus: null,
    };

const initialState: AccountState = persistedState;

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    setAccountCert: (state, action: PayloadAction<string>) => {
      state.accountCert = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    setStatus: (
      state,
      action: PayloadAction<"PENDING" | "APPROVED" | "REJECTED">,
    ) => {
      state.status = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    setKycCert: (state, action: PayloadAction<string>) => {
      state.kycCert = action.payload;
      state.status = "APPROVED";
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    setEmailStatus: (state, action: PayloadAction<"APPROVED">) => {
      state.emailStatus = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    clearAccount: (state) => {
      state.accountId = null;
      state.accountCert = null;
      state.status = null;
      state.kycCert = null;
      state.emailStatus = null;
      localStorage.removeItem("accountState");
    },
  },
});

export const {
  setAccountId,
  setAccountCert,
  setStatus,
  setKycCert,
  clearAccount,
  setEmailStatus, // Export new action
} = accountSlice.actions;

export default accountSlice.reducer;
