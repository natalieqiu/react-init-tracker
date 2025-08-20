import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-init-tracker/',
  build: {
    assetsDir: 'assets', // organized asset directory
  }
})
