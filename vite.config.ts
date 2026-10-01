import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  // Capacitor serves dist/ from https://localhost/, so the default root base works
  // for both the website and the Android WebView.
  base: '/',
  plugins: [
    react(),
    VitePWA({
      // Registered manually in src/main.tsx (web only, not inside Capacitor).
      injectRegister: null,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Bhaye Mindoro',
        short_name: 'Bhaye Mindoro',
        description: 'Gabay sa pamasahe at biyahe sa Mindoro',
        lang: 'fil',
        start_url: '/',
        display: 'standalone',
        background_color: '#F4FAF6',
        theme_color: '#1FAE5B',
        icons: [{ src: 'icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
});
