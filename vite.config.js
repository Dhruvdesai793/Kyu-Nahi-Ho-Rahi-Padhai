import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    // Only apply the repo path in production build, use root for dev
    base: mode === 'production' ? '/Kyu-Nahi-Ho-Rahi-Padhai/' : '/',
  }
})