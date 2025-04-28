import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  accountId: string | null;
  accountCert: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  documentStatus: "PENDING" | null;
  kycCert: string | null;
  emailStatus: "APPROVED" | null; // Add email status
  phoneStatus: "APPROVED" | null;
}

const persistedState = localStorage.getItem("accountState")
  ? JSON.parse(localStorage.getItem("accountState")!)
  : {
      accountId: null,
      accountCert: null,
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
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
    setDocumentStatus: (state, action: PayloadAction<"PENDING">) => {
      state.documentStatus = action.payload;
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
    setPhoneStatus: (state, action: PayloadAction<"APPROVED">) => {
      state.phoneStatus = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    clearAccount: (state) => {
      state.accountId = null;
      state.accountCert = null;
      state.status = null;
      state.documentStatus = null;
      state.kycCert = null;
      state.emailStatus = null;
      state.phoneStatus = null;
      localStorage.removeItem("accountState");
    },
  },
});

export const {
  setAccountId,
  setAccountCert,
  setStatus,
  setDocumentStatus,
  setKycCert,
  clearAccount,
  setEmailStatus,
  setPhoneStatus,
} = accountSlice.actions;

export default accountSlice.reducer;
