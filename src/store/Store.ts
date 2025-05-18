import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import storage from '@wua/services/keyManagement/storageSetup.ts';
import { ReduxStorage } from '@wua/shared/redux.storage.ts';
import { reduxLogger } from '@wua/store/redux-logger.ts';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';
import accountReducer from '../slices/account.slice.ts';
import configSlice from '../slices/config.slice';
import { baseObsApi } from '../slices/obs-api.slice.ts';
import { basePrfApi } from '../slices/prf-api.slice.ts';

// Combine multiple reducers if needed
export const rootReducer = combineReducers({
  account: accountReducer,
  config: configSlice,
  [basePrfApi.reducerPath]: basePrfApi.reducer,
  [baseObsApi.reducerPath]: baseObsApi.reducer,
});

const persistedReducer = persistReducer(
  {
    key: `root::webank:${import.meta.env.MODE}`,
    storage: new ReduxStorage(storage),
    whitelist: ['account'], // Only persist the account slice
  },
  rootReducer,
);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(basePrfApi.middleware)
      .concat(baseObsApi.middleware)
      .concat([reduxLogger]),
});

// Create a persistor instance
export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Type definitions for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
