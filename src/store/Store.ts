import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses local storage
import { combineReducers } from "redux";
import accountReducer from "../slices/accountSlice"; // Import your reducers

// Combine multiple reducers if needed
export const rootReducer = combineReducers({
  account: accountReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Wrap the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors with Redux Persist
    }),
});

// Create a persistor instance
export const persistor = persistStore(store);

// Type definitions for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
