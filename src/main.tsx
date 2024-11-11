import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType} from 'react-router-dom';
import { getWebInstrumentations, initializeFaro, ReactIntegration, ReactRouterVersion } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

initializeFaro({
  // Replace with ADORSYS' grafana cloud webank-userapp collector url
  url: 'URL',
  app: {
    name: 'webank-userapp',
    version: '1.0.0',
    environment: 'production'
  }, 
  instrumentations: [
    // Mandatory, omits default instrumentations otherwise.
    ...getWebInstrumentations(),

    // Tracing package to get end-to-end visibility for HTTP requests.
    new TracingInstrumentation(),

    new ReactIntegration({
      router: {
        version: ReactRouterVersion.V6,
        dependencies: {
          createRoutesFromChildren, 
          matchRoutes, 
          Routes, 
          useLocation, 
          useNavigationType
        }
      }     
    })
  ]
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
