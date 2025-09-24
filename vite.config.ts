
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del entorno de construcción (como en Netlify)
  // Fix: Replaced process.cwd() with '.' to resolve the TypeScript type error for 'process'.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Esta sección es crucial.
    // Toma la API_KEY del entorno de construcción y la hace
    // disponible en el código del cliente como 'process.env.API_KEY'.
    // Esto permite que tu servicio de Gemini funcione sin cambios.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
