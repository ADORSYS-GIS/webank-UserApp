import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface AccountState {
  accountId: string | null;
  accountCert: string | null;
}

// Load persisted state from localStorage (if available)
const persistedState = localStorage.getItem("accountState")
  ? JSON.parse(localStorage.getItem("accountState")!)
  : { accountId: null, accountCert: null };

// Initial state
const initialState: AccountState = persistedState;

// Create a slice
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state)); // Persist to localStorage
    },
    setAccountCert: (state, action: PayloadAction<string>) => {
      state.accountCert = action.payload;
      localStorage.setItem("accountState", JSON.stringify(state)); // Persist to localStorage
    },
    clearAccountId: (state) => {
      state.accountId = null;
      state.accountCert = null;
      localStorage.removeItem("accountState"); // Remove from localStorage when clearing
    },
  },
});

// Export actions
export const { setAccountId, setAccountCert, clearAccountId } = accountSlice.actions;

// Export the reducer
export default accountSlice.reducer;
