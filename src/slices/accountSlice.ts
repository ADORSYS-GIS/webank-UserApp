import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface AccountState {
  accountId: string | null;
  accountCert: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null; // KYC Status
  kycCert: string | null; // Store the actual certificate if available
}

// Load persisted state from localStorage (if available)
const persistedState = localStorage.getItem("accountState")
  ? JSON.parse(localStorage.getItem("accountState")!)
  : { accountId: null, accountCert: null, status: null, kycCert: null };

// Initial state
const initialState: AccountState = persistedState;

// Create a slice
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
      state.status = "APPROVED"; // Automatically approve once cert is received
      localStorage.setItem("accountState", JSON.stringify(state));
    },
    clearAccount: (state) => {
      state.accountId = null;
      state.accountCert = null;
      state.status = null;
      state.kycCert = null;
      localStorage.removeItem("accountState");
    },
  },
});

// Export actions
export const {
  setAccountId,
  setAccountCert,
  setStatus,
  setKycCert,
  clearAccount,
} = accountSlice.actions;

// Export the reducer
export default accountSlice.reducer;
