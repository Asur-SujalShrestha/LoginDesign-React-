import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.cert'))
    },
    proxy: {
      '/ws/video': {
        target: 'https://192.168.1.19:8081',  // Backend URL
        ws: true,  // Enable WebSocket proxying
        changeOrigin: true,
        secure: false  // Disable SSL verification for the proxy
      }
    },
    host: '0.0.0.0',
    port: 5173,
  }
});
