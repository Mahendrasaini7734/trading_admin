import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/excel': {
        target: 'https://trading.stackearn.com',
        changeOrigin: true,
        secure: false
      },
      '/markets': {
        target: 'https://trading.stackearn.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})