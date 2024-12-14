import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Default root directory
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', // Explicitly define the entry point
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 3000, // Use custom port
    open: true, // Automatically open browser
  },
  envDir: './env', // Support environment variables
});
