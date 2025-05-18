import './shared/register.sw.ts';
import './index.scss';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ReduxProvider } from './store/redux-provider';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <ReduxProvider>
    <App />
  </ReduxProvider>,
);