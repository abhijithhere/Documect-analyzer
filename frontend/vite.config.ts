import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 👇 Check environment — Render sets NODE_ENV to 'production' during deployment
const isRender = process.env.RENDER === 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: isRender
      ? undefined // No proxy in production
      : {
          '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
  },
});
