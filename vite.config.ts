import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { aiApiPlugin } from './vite-plugin-ai-api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), aiApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
