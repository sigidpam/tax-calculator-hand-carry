import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'inline',
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Kalkulator Pajak Hand-Carry',
        short_name: 'Pajak HC',
        description: 'Estimasi bea masuk dan PPN barang bawaan penumpang sesuai PMK 34/2025.',
        lang: 'id',
        start_url: '/',
        display: 'standalone',
        background_color: '#EFEDE6',
        theme_color: '#EFEDE6',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
});
