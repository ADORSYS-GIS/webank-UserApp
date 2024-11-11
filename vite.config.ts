import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Replace with the endpoint, stack id, app id and api key of ADORSYS' grafana cloud
    faroUploader({
      appName: 'webank-userapp',
      endpoint: 'END POINT',
    appId: 'APP ID',
      stackId: 'STACK ID',
      apiKey: 'API KEY',
    }),

    react(), 
    VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'webank-UserApp',
      short_name: 'UserApp',
      description: 'For regular users of webank!',
      theme_color: '#ffffff',
    },

    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],

})