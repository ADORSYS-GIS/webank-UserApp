import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import progress from 'vite-plugin-progress';
import bundlesize from 'vite-plugin-bundlesize';
import { analyzer } from 'vite-bundle-analyzer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import tsconfigPaths from 'vite-tsconfig-paths';
import { Buffer } from 'buffer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const base64Encode = (plaintext: string): string => {
  return Buffer.from(plaintext).toString('base64');
};

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        format: 'es',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        manualChunks(id) {
          if (/projectEnvVariables.ts/.test(id)) {
            return `projectEnvVariables.${mode}`;
          }

          //TODO Improve this to not load 100+ modules
          if (id.includes('node_modules')) {
            const cleanName = id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
            return cleanName + '~' + base64Encode(cleanName);
          }
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'production' && progress(),
    tsconfigPaths(),
    ViteMinifyPlugin(),
    bundlesize({
      limits: [
        { name: 'assets/index-*.js', limit: '1000 kB' },
        { name: '**/*', limit: '150 kB' },
      ],
    }),
    analyzer({
      summary: true,
      analyzerMode: 'static',
      fileName: `ignored.${mode}.report.html`,
    }),
    ViteImageOptimizer(),
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
        share_target: {
          action: '/share-handler',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            title: 'title',
            text: 'text',
            url: 'url',
            files: [
              {
                name: 'files',
                accept: [
                  'image/*',
                  'application/pdf',
                  'text/plain',
                ],
              },
            ],
          },
        },
        icons: [
          {
            src: '/assets/images/android-chrome-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/assets/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: '/assets/images/Screenshot_otp.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'wide',
          },
          {
            src: '/assets/images/Screenshot_dashboard.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'wide',
          },
          {
            src: '/assets/images/Screenshot_register.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'wide',
          },
          {
            src: '/assets/images/Screenshot_register.png',
            type: 'image/png',
            sizes: '472x923',
            form_factor: 'narrow',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,jpg,jpeg,woff2,woff,ttf,json}'],
      },
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
  server: {
    proxy: {
      '/share-handler': {
        target: 'http://localhost:5173',
        rewrite: () => '/index.html',
      },
    },
  },
}));