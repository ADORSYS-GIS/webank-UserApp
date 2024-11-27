import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
        output: {
            format: 'es',
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
            manualChunks(id) {
                if (/projectEnvVariables.ts/.test(id)) {
                    return 'projectEnvVariables'
                }
            },
        },
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false,

      manifest: {
        name: 'Webank',
        short_name: 'Webank',
        description: 'For regular users of Webank!',
        theme_color: 'white',
        background_color: 'white',
        start_url: '/',
        display_override: ['standalone', 'minimal-ui'],
        display: 'standalone',
        id: 'webank_user_app',

        icons: [
          {
            src: '/android-chrome-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: "any",
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],

        screenshots: [
          {
            src: '/Screenshot_otp.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'wide',
          },
          {
            src: '/Screenshot_dashboard.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'wide',
          },
          {
            src: '/Screenshot_register.png',
            type: 'image/png',
            sizes: '472x923',

            form_factor: 'wide',
          },
          {
            src: '/Screenshot_register.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'narrow',
          },
        ],
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
    }),
  ],
});
