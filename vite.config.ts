import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og-image.png'],
      manifest: {
        name: 'PawCare — Sistema Veterinario',
        short_name: 'PawCare',
        description: 'Sistema de gestión para clínicas veterinarias',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        // PNG y no SVG: iOS no admite iconos SVG en el manifest, así que la app
        // instalada en un iPhone se quedaba sin icono. Y el `maskable` es un archivo
        // aparte de verdad: Android recorta con su propia forma (círculo o squircle),
        // y el icono normal llega al 141% del radio disponible — le cortaría los dedos.
        // El maskable llega al 58%, dentro del 80% que exige la especificación.
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
