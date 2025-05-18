import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountState {
  accountId?: string;
  accountCert?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  kycCert?: string;
  emailStatus?: 'APPROVED';
  phoneStatus?: 'APPROVED';
}

const initialState: AccountState = {};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<AccountState['accountId']>) => {
      state.accountId = action.payload;
    },
    setAccountCert: (state, action: PayloadAction<AccountState['accountCert']>) => {
      state.accountCert = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<AccountState['status']>,
    ) => {
      state.status = action.payload;
    },
    setDocumentStatus: (
      state,
      action: PayloadAction<AccountState['documentStatus']>,
    ) => {
      state.documentStatus = action.payload;
    },
    setKycCert: (state, action: PayloadAction<AccountState['kycCert']>) => {
      state.kycCert = action.payload;
      state.status = 'APPROVED';
    },
    setEmailStatus: (state, action: PayloadAction<AccountState['emailStatus']>) => {
      state.emailStatus = action.payload;
    },
    setPhoneStatus: (state, action: PayloadAction<AccountState['phoneStatus']>) => {
      state.phoneStatus = action.payload;
    },
    clearAccount: (state) => {
      state.accountId = undefined;
      state.accountCert = undefined;
      state.status = undefined;
      state.documentStatus = undefined;
      state.kycCert = undefined;
      state.emailStatus = undefined;
      state.phoneStatus = undefined;
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
