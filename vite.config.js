import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The project lives in a OneDrive folder, where native file events can be missed.
  server: { watch: { usePolling: true, interval: 300 } },
})
