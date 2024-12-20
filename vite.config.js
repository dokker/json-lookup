import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/json-lookup/', // Add this line - should match your repository name
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Map '@/' to the 'src' folder
    },
  },
})

