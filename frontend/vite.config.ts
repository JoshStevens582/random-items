import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind IPv4 loopback so http://127.0.0.1:5173 works (Vite's default
    // can end up on [::1] only, which refuses 127.0.0.1).
    host: '127.0.0.1',
    port: 5173,
  },
})
