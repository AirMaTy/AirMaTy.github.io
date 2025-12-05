import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite simple pour un déploiement statique (GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react()],
});
