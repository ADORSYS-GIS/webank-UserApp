import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PropsWithChildren } from 'react';
import { persistor, store } from './Store';
import { LoadingPage } from '../pages/LoadingPage';

export function ReduxProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingPage />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}