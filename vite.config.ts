import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // গিটহাবে সাব-ফোল্ডারে চললে এটি প্রয়োজন
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
  },
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  }
});