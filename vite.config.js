import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy for user-service (port 8082)
      '/api/v1/users': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      // Proxy for court-service (port 8081)
      '/api/v1/courts': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/v1/monitor': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // Proxy for post-service (port 8083)
      '/api/v1/posts': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/v1/comments': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/v1/messages': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    },
  },
})