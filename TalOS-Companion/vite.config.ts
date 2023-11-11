import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: '../../',
  resolve: {
    alias: {
      // Alias '@' to a specific node_modules folder
      '@': '../../node_modules',
    },
  },
  plugins: [react()],
})
