
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del entorno de construcción (como en Netlify)
  // Fix: Replaced process.cwd() with '.' to resolve the TypeScript type error for 'process'.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Mi Diario de Campo',
          short_name: 'Diario',
          description: 'Una herramienta integral para futuros docentes de Educación Física para registrar experiencias, reflexionar sobre la práctica, establecer metas profesionales, y conectar con la teoría del curso. Incluye soporte para etiquetas, competencias, adjuntos de imagen y exportación.',
          theme_color: '#fecdd3',
          background_color: '#f0fdf4',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'iphone-safari-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'iphone-safari-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    // Esta sección es crucial.
    // Toma la API_KEY del entorno de construcción y la hace
    // disponible en el código del cliente como 'process.env.API_KEY'.
    // Esto permite que tu servicio de Gemini funcione sin cambios.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});