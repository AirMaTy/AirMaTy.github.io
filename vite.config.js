import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite pour un déploiement GitHub Pages (racine du site utilisateur)
export default defineConfig({
  base: '/',
  plugins: [react()],
});
