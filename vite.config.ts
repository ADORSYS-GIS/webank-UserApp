import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [

    faroUploader({
      appName: 'webank-userapp',
      endpoint: 'https://faro-api-prod-us-east-0.grafana.net/faro/api/v1',
      appId: '2403',
      stackId: '1085430',
      apiKey: 'glc_eyJvIjoiMTI2Njk5OSIsIm4iOiJ1c2VyLWFwcC11cGxvYWQta2V5LWFwcHRva2VuIiwiayI6IjkyMzJSVjlOVzk4eG14NUpyQzIwVXFjcCIsIm0iOnsiciI6InVzIn19',
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